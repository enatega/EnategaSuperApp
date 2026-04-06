import type { DeliveryOrderTimelineItem } from "../../../api/ordersServiceTypes";

export function formatTrackingEta(
  estimatedDeliveryTime: number | string | null | undefined,
  scheduledAt: string | null | undefined,
) {
  if (typeof estimatedDeliveryTime === "number") {
    return `${estimatedDeliveryTime} min`;
  }

  if (typeof estimatedDeliveryTime === "string" && estimatedDeliveryTime.trim()) {
    return estimatedDeliveryTime.trim();
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
