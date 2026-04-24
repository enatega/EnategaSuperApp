import type {
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
  if (Array.isArray(orderLogs) && orderLogs.length > 0) {
    return orderLogs.map((log, index) => ({
      completedAt: formatTimelineLogTime(log.timestamp),
      key: `${log.status}-${index}`,
      stepKey: log.status,
      title: log.message?.trim() || log.actor?.trim() || log.status,
      tone: "completed" as const,
    }));
  }

  return (timeline ?? []).map((item, index) => ({
    completedAt: formatCompletedTime(item.completedAt),
    key: `${item.key}-${index}`,
    stepKey: item.key,
    title: item.title,
    tone: getTimelineTone(item),
  }));
}
