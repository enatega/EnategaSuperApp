import type { DeliveryOrderStatus } from "../../api/ordersServiceTypes";

export const ETA_GRADIENTS = {
  bottomLeft: ["#06B6D4", "#F59E0B"] as const,
  leftTop: ["#16A34A", "#06B6D4"] as const,
  rightBottom: ["#FEDB03", "#F59E0B"] as const,
  topRight: ["#FEDB03", "#FEDB03"] as const,
};

export function getEtaFrameSegments(status: DeliveryOrderStatus) {
  const isStage4 = status === "delivered";
  const isStage3 =
    isStage4 ||
    status === "picked_up" ||
    status === "out_for_delivery" ||
    status === "arrived";
  const isStage2 =
    isStage3 || status === "preparing" || status === "ready" || status === "rider_assigned";
  const isStage1 =
    isStage2 || status === "accepted" || status === "pending" || status === "scheduled";

  return {
    bottomLeft: isStage3,
    leftTop: isStage4,
    rightBottom: isStage2,
    topRight: isStage1,
  };
}

export function getProgressLabel(status: DeliveryOrderStatus) {
  if (status === "delivered") return "Delivered";
  if (status === "picked_up" || status === "out_for_delivery" || status === "arrived") {
    return "On the way";
  }
  if (status === "preparing" || status === "ready" || status === "rider_assigned") {
    return "Preparing";
  }
  return "Confirmed";
}

export function getNextLabel(status: DeliveryOrderStatus) {
  if (status === "delivered") return "---";
  if (status === "picked_up" || status === "out_for_delivery" || status === "arrived") {
    return "Delivered";
  }
  if (status === "preparing" || status === "ready" || status === "rider_assigned") {
    return "On the way";
  }
  return "Preparing";
}

export function getProgressSegments(status: DeliveryOrderStatus) {
  if (status === "delivered") {
    return ["#FEDB03", "#F59E0B", "#06B6D4", "#10B981"];
  }
  if (status === "picked_up" || status === "out_for_delivery" || status === "arrived") {
    return ["#FEDB03", "#F59E0B", "#06B6D4", null];
  }
  if (status === "preparing" || status === "ready" || status === "rider_assigned") {
    return ["#FEDB03", "#F59E0B", null, null];
  }
  return ["#FEDB03", null, null, null];
}

export function getPreviewImages(previewImages: string[]) {
  return previewImages.slice(0, 2);
}
