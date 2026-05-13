import type {
  DeliveryOrderStatus,
  DeliveryOrderLogItem,
  DeliveryOrderTimelineItem,
} from "../../api/ordersServiceTypes";

export function formatTrackingEta(
  estimatedDeliveryTime: number | string | null | undefined,
  scheduledAt: string | null | undefined,
) {
  if (typeof estimatedDeliveryTime === "number") {
    return `${Math.round(estimatedDeliveryTime)} min`;
  }

  if (typeof estimatedDeliveryTime === "string" && estimatedDeliveryTime.trim()) {
    const normalizedEta = estimatedDeliveryTime.trim();

    if (/^\d+(?:\.\d+)?$/.test(normalizedEta)) {
      return `${Math.round(Number(normalizedEta))} min`;
    }

    if (/^\d+\s*-\s*\d+$/.test(normalizedEta)) {
      return `${normalizedEta.replace(/\s+/g, "")} min`;
    }

    return normalizedEta;
  }

  if (!scheduledAt) {
    return "--";
  }

  const date = new Date(scheduledAt);

  if (Number.isNaN(date.getTime())) {
    return scheduledAt;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCompletedTime(completedAt: string | null | undefined) {
  if (!completedAt) {
    return null;
  }

  const date = new Date(completedAt);

  if (Number.isNaN(date.getTime())) {
    return completedAt;
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getTimelineTone(item: DeliveryOrderTimelineItem) {
  if (item.completed) {
    return "completed" as const;
  }

  if (item.active) {
    return "active" as const;
  }

  return "upcoming" as const;
}

export function formatTimelineLogTime(timestamp: string | null | undefined) {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getOrderTrackingTimelineEntries(
  timeline: DeliveryOrderTimelineItem[] | null | undefined,
  orderLogs: DeliveryOrderLogItem[] | null | undefined,
) {
  const statusTimes = buildStatusTimestampMap(orderLogs ?? []);
  const completedStatuses = CUSTOMER_STATUS_FLOW.filter((status) => Boolean(statusTimes[status]));

  if (completedStatuses.length === 0) {
    return (timeline ?? []).map((item, index) => ({
      completedAt: formatCompletedTime(item.completedAt),
      key: `${item.key}-${index}`,
      stepKey: item.key,
      title: item.title,
      tone: getTimelineTone(item),
    }));
  }

  return completedStatuses.map((status, index) => ({
    completedAt: statusTimes[status] ? formatTimelineLogTime(statusTimes[status]) : null,
    key: `${status}-${index}`,
    stepKey: status,
    title: CUSTOMER_STATUS_LABELS[status] ?? status,
    tone: "completed" as const,
  }));
}

const CUSTOMER_STATUS_LABELS: Partial<Record<DeliveryOrderStatus, string>> = {
  scheduled: "Order scheduled",
  pending: "Order pending",
  accepted: "Order accepted",
  preparing: "Order preparing",
  picked_up: "Order picked up",
  delivered: "Order delivered",
  cancelled: "Order cancelled",
  rejected: "Order rejected",
  failed: "Order failed",
};

const CUSTOMER_STATUS_FLOW: DeliveryOrderStatus[] = [
  "scheduled",
  "pending",
  "accepted",
  "preparing",
  "picked_up",
  "delivered",
  "cancelled",
  "rejected",
  "failed",
];

function normalizeCustomerStatus(
  status: DeliveryOrderStatus | null | undefined,
): DeliveryOrderStatus | null {
  if (!status) return null;

  if (status === "ready" || status === "rider_assigned") {
    return "preparing";
  }

  if (status === "out_for_delivery" || status === "arrived") {
    return "picked_up";
  }

  return status;
}

function buildStatusTimestampMap(logs: DeliveryOrderLogItem[]) {
  const map: Partial<Record<DeliveryOrderStatus, string>> = {};

  for (const log of logs) {
    const status = normalizeCustomerStatus(log.status);
    if (!status || !log.timestamp) continue;
    if (!map[status]) {
      map[status] = log.timestamp;
    }
  }

  return map;
}
