import {
  type OrderTrackingVariant,
} from "../../../general/stores/useAppConfigStore";

const SUPPORTED_VARIANTS: Record<OrderTrackingVariant, OrderTrackingVariant> = {
  legacy: "legacy",
  modern: "modern",
};

export function resolveOrderTrackingVariant(
  candidate: string | null | undefined,
): OrderTrackingVariant {
  if (candidate === "figma_v2") {
    return "modern";
  }

  if (candidate === "legacy" || candidate === "modern") {
    return SUPPORTED_VARIANTS[candidate];
  }
  return "legacy";
}
