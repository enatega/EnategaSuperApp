import type {
  DeliveryOrderItems,
  DeliveryOrderProduct,
  DeliveryOrderProductAddon,
} from "../../../api/ordersServiceTypes";

export function getProductAddonLines(product: DeliveryOrderProduct) {
  const addonCollections = [
    product.addons,
    product.addOns,
    product.modifiers,
    product.options,
    product.customizations,
  ];

  return addonCollections.flatMap((collection) =>
    Array.isArray(collection)
      ? collection
          .map((item) => formatAddonLine(item))
          .filter((item): item is string => Boolean(item))
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

function formatAddonLine(item: DeliveryOrderProductAddon | string) {
  if (typeof item === "string") {
    const trimmedItem = item.trim();
    return trimmedItem.length > 0 ? trimmedItem : null;
  }

  const baseLabel =
    item.name?.trim() ||
    item.title?.trim() ||
    item.label?.trim() ||
    item.value?.trim();

  if (!baseLabel) {
    return null;
  }

  if (typeof item.quantity === "number" && item.quantity > 1) {
    return `${baseLabel} x${item.quantity}`;
  }

  return baseLabel;
}
