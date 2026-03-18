import type { LatLng } from "react-native-maps";
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../../../api/types";

export type SeeAllMapStore = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  deliveryFee?: number;
  deliveryTime?: number | string;
  distanceKm?: number;
  coordinate?: LatLng;
};

export const SEE_ALL_DEFAULT_USER_COORDINATE: LatLng = {
  latitude: 33.7039543,
  longitude: 72.9680349,
};

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function resolveCoordinate(candidate: {
  latitude?: number | null;
  longitude?: number | null;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
}) {
  const latitude = toNumber(candidate.latitude) ?? toNumber(candidate.storeLatitude);
  const longitude =
    toNumber(candidate.longitude) ?? toNumber(candidate.storeLongitude);

  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }

  return {
    latitude,
    longitude,
  };
}

export function isShopTypeProductItem(
  item: DeliveryNearbyStore | DeliveryShopTypeProduct,
): item is DeliveryShopTypeProduct {
  return "productId" in item;
}

export function toSeeAllMapStore(
  item: DeliveryNearbyStore | DeliveryShopTypeProduct,
  _index: number,
): SeeAllMapStore {
  if (isShopTypeProductItem(item)) {
    return {
      id: `${item.productId}-${item.storeId}`,
      title: item.storeName ?? item.productName,
      subtitle: item.storeAddress ?? undefined,
      imageUrl:
        item.storeImage ??
        item.storeLogo ??
        item.productImage ??
        "https://placehold.co/200x200.png",
      rating: item.averageRating ?? undefined,
      reviewCount: item.reviewCount ?? undefined,
      deliveryFee: item.baseFee ?? item.price ?? undefined,
      deliveryTime: item.deliveryTime ?? undefined,
      distanceKm: item.distanceKm ?? undefined,
      coordinate: resolveCoordinate(item),
    };
  }

  return {
    id: item.storeId,
    title: item.name,
    subtitle: item.address ?? undefined,
    imageUrl:
      item.coverImage ?? item.logo ?? "https://placehold.co/200x200.png",
    rating: item.averageRating ?? undefined,
    reviewCount: item.reviewCount ?? undefined,
    deliveryFee: item.baseFee ?? undefined,
    deliveryTime: item.deliveryTime ?? undefined,
    distanceKm: item.distanceKm ?? undefined,
    coordinate: resolveCoordinate(item),
  };
}

export function formatMapMarkerLabel(label: string) {
  if (label.length <= 15) {
    return label;
  }

  return `${label.slice(0, 12).trimEnd()}...`;
}
