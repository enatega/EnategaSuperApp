import type { DeliveryOrderStatus } from "../../api/ordersServiceTypes";
import type { ThemeColors } from "../../../../general/theme/colors";

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

export function getProgressSegments(status: DeliveryOrderStatus, colors: ThemeColors) {
  const stages = [colors.yellow500, colors.warning, colors.blue500, colors.success];

  if (status === "delivered") {
    return stages;
  }
  if (status === "picked_up" || status === "out_for_delivery" || status === "arrived") {
    return [...stages.slice(0, 3), null];
  }
  if (status === "preparing" || status === "ready" || status === "rider_assigned") {
    return [...stages.slice(0, 2), null, null];
  }
  return [stages[0], null, null, null];
}

export function getPreviewImages(previewImages: string[]) {
  return previewImages.slice(0, 2);
}
