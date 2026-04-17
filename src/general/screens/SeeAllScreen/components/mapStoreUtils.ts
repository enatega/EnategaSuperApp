import type { LatLng } from 'react-native-maps';

export type SeeAllMapStoreSource = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  deliveryFee?: number;
  deliveryTime?: number | string;
  distanceKm?: number;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

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
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number(value.trim());

    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

function resolveCoordinate(candidate: {
  latitude?: number | string | null;
  longitude?: number | string | null;
}) {
  const latitude = toNumber(candidate.latitude);
  const longitude = toNumber(candidate.longitude);

  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }

  return {
    latitude,
    longitude,
  };
}

export function toSeeAllMapStore(item: SeeAllMapStoreSource): SeeAllMapStore {
  return {
    id: item.id,
    title: item.title,
    subtitle: item.subtitle,
    imageUrl: item.imageUrl ?? 'https://placehold.co/200x200.png',
    rating: item.rating,
    reviewCount: item.reviewCount,
    deliveryFee: item.deliveryFee,
    deliveryTime: item.deliveryTime,
    distanceKm: item.distanceKm,
    coordinate: resolveCoordinate(item),
  };
}

export function formatMapMarkerLabel(label: string) {
  if (label.length <= 15) {
    return label;
  }

  return `${label.slice(0, 12).trimEnd()}...`;
}
