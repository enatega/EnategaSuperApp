import type {
  DeliveryOrderItems,
  DeliveryOrderProduct,
  DeliveryOrderProductAddon,
} from "../../api/ordersServiceTypes";

export type OrderProductAddonLine = {
  label: string;
  priceLabel: string | null;
};

export function getProductAddonLines(product: DeliveryOrderProduct) {
  const addonCollections = [
    product.addons,
    product.addOns,
    product.modifiers,
    product.options,
    product.customizations,
    product.selectedOptions,
  ];

  return addonCollections.flatMap((collection) =>
    Array.isArray(collection)
      ? collection
          .map((item) => formatAddonLine(item))
          .filter((item): item is OrderProductAddonLine => Boolean(item))
      : [],
  );
}

export function getOrderPreviewImages(orderItems: DeliveryOrderItems) {
  const previewImages = orderItems.previewImages.filter(Boolean);

  if (previewImages.length > 0) {
    return previewImages.slice(0, 3);
  }

  return orderItems.products
    .map((product) => product.image)
    .filter((image): image is string => Boolean(image))
    .slice(0, 3);
}

export function getRemainingOrderItemsCount(orderItems: DeliveryOrderItems) {
  if (orderItems.additionalItemsCount > 0) {
    return orderItems.additionalItemsCount;
  }

  return Math.max(orderItems.products.length - getOrderPreviewImages(orderItems).length, 0);
}

function formatAddonLine(
  item: DeliveryOrderProductAddon | string,
): OrderProductAddonLine | null {
  if (typeof item === "string") {
    const trimmedItem = item.trim();
    return trimmedItem.length > 0
      ? {
          label: trimmedItem,
          priceLabel: null,
        }
      : null;
  }

  const optionLabel =
    item.optionName?.trim() ||
    item.name?.trim() ||
    item.title?.trim() ||
    item.label?.trim() ||
    item.value?.trim();
  const groupLabel = item.groupName?.trim();
  const baseLabel =
    groupLabel && optionLabel && groupLabel !== optionLabel
      ? `${groupLabel}: ${optionLabel}`
      : optionLabel;

  if (!baseLabel) {
    return null;
  }

  const lineLabel =
    typeof item.quantity === "number" && item.quantity > 1
      ? `${baseLabel} x${item.quantity}`
      : baseLabel;
  const priceLabel =
    typeof item.price === "number" && item.price > 0 ? `US$${item.price.toFixed(2)}` : null;

  return {
    label: lineLabel,
    priceLabel,
  };
}
