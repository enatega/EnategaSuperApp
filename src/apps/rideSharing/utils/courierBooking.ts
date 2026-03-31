import type { CreateRidePayload, RideAddressSelection } from '../api/types';
import type { CourierBookingState } from '../stores/useCourierBookingStore';

type CourierBookingSnapshot = Pick<CourierBookingState, 'activeTab' | 'toBuilding' | 'toDoor'>;

const PACKAGE_SIZE_WEIGHT_MAP = {
  S: 5,
  M: 15,
  L: 20,
} as const;

const COURIER_PACKAGE_TYPE_MAP: Record<string, string> = {
  food: 'food',
  clothes: 'cloth',
  cloth: 'cloth',
  documents: 'documents',
  electronics: 'electronics',
  pharmacy: 'pharmacy',
};

function trimValue(value: string) {
  return value.trim();
}

function normalizeCourierPackageTypes(categories: string[]) {
  return categories
    .map((category) => COURIER_PACKAGE_TYPE_MAP[trimValue(category).toLowerCase()])
    .filter((category): category is string => Boolean(category));
}

export function isCourierRideRequest(value?: string | null) {
  return /courier/i.test(value ?? '');
}

export function getCourierComment(snapshot: CourierBookingSnapshot) {
  const comments = snapshot.activeTab === 'door'
    ? snapshot.toDoor.comments
    : snapshot.toBuilding.comments;

  const normalizedComments = trimValue(comments);
  return normalizedComments.length > 0 ? normalizedComments : null;
}

export function isCourierBookingValid(snapshot: CourierBookingSnapshot) {
  if (snapshot.activeTab === 'door') {
    return (
      trimValue(snapshot.toDoor.senderPhone).length >= 10
      && trimValue(snapshot.toDoor.recipientPhone).length >= 10
      && trimValue(snapshot.toDoor.pickupStreet).length > 0
      && trimValue(snapshot.toDoor.deliveryStreet).length > 0
      && snapshot.toDoor.categories.length > 0
    );
  }

  return (
    trimValue(snapshot.toBuilding.senderPhone).length >= 10
    && trimValue(snapshot.toBuilding.recipientPhone).length >= 10
    && snapshot.toBuilding.categories.length > 0
  );
}

export function buildCourierCreateRidePayload(params: {
  snapshot: CourierBookingSnapshot;
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
}): Partial<CreateRidePayload> {
  const { snapshot, fromAddress, toAddress } = params;

  if (snapshot.activeTab === 'door') {
    return {
      courier_delivery_mode: 'TO_DOOR',
      sender_phone_number: trimValue(snapshot.toDoor.senderPhone),
      receiver_phone_number: trimValue(snapshot.toDoor.recipientPhone),
      comments_for_courier: trimValue(snapshot.toDoor.comments) || undefined,
      package_size: PACKAGE_SIZE_WEIGHT_MAP[snapshot.toDoor.packageSize],
      package_size_category: snapshot.toDoor.packageSize,
      package_types: normalizeCourierPackageTypes(snapshot.toDoor.categories),
      pickup_street_building: trimValue(snapshot.toDoor.pickupStreet) || undefined,
      pickup_address_details: trimValue(snapshot.toDoor.pickupDetails) || undefined,
      destination_street_building: trimValue(snapshot.toDoor.deliveryStreet) || undefined,
      destination_address_details: trimValue(snapshot.toDoor.deliveryDetails) || undefined,
      pickup_coordinates: {
        lat: fromAddress.coordinates.latitude,
        lng: fromAddress.coordinates.longitude,
      },
      destination_coordinates: {
        lat: toAddress.coordinates.latitude,
        lng: toAddress.coordinates.longitude,
      },
    };
  }

  return {
    courier_delivery_mode: 'TO_BUILDING',
    sender_phone_number: trimValue(snapshot.toBuilding.senderPhone),
    receiver_phone_number: trimValue(snapshot.toBuilding.recipientPhone),
    comments_for_courier: trimValue(snapshot.toBuilding.comments) || undefined,
    package_size: PACKAGE_SIZE_WEIGHT_MAP[snapshot.toBuilding.packageSize],
    package_size_category: snapshot.toBuilding.packageSize,
    package_types: normalizeCourierPackageTypes(snapshot.toBuilding.categories),
    pickup_coordinates: {
      lat: fromAddress.coordinates.latitude,
      lng: fromAddress.coordinates.longitude,
    },
    destination_coordinates: {
      lat: toAddress.coordinates.latitude,
      lng: toAddress.coordinates.longitude,
    },
  };
}
