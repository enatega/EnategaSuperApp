import type { AddressType } from '../api/addressService';
import type { ProfileAddress } from '../multiVendor/api/profileService';
import type { DeliveryAddress } from '../stores/useAddressStore';

type DeliveryAddressInput = {
  id?: string;
  address: string;
  locationName?: string | null;
  latitude: number;
  longitude: number;
  type?: AddressType;
};

type SavedAddressInput = {
  id: string;
  address: string;
  location: {
    coordinates: [number, number];
  };
  location_name: string | null;
  type: AddressType;
  is_selected?: boolean;
};

function toFiniteNumber(value: number | string | undefined) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
}

export function createDeliveryAddress(
  input: DeliveryAddressInput,
): DeliveryAddress {
  return {
    id: input.id,
    address: input.address,
    locationName: input.locationName ?? null,
    latitude: input.latitude,
    longitude: input.longitude,
    type: input.type,
  };
}

export function formatDeliveryAddressLabel(
  address: Pick<DeliveryAddress, 'address' | 'locationName'> | null | undefined,
) {
  if (!address) {
    return null;
  }

  const locationName = address.locationName?.trim();
  const addressLine = address.address.trim();

  if (locationName && addressLine) {
    return `${locationName} - ${addressLine}`;
  }

  return locationName || addressLine || null;
}

export function areDeliveryAddressesEqual(
  first: DeliveryAddress | null | undefined,
  second: DeliveryAddress | null | undefined,
) {
  if (first === second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  return (
    first.id === second.id &&
    first.address === second.address &&
    first.locationName === second.locationName &&
    first.latitude === second.latitude &&
    first.longitude === second.longitude &&
    first.type === second.type
  );
}

export function getSelectedSavedAddressId(
  addresses:
    | Array<Pick<SavedAddressInput, 'id' | 'is_selected'>>
    | null
    | undefined,
) {
  return addresses?.find((address) => address.is_selected)?.id;
}

export function getSelectedSavedAddress(
  addresses: SavedAddressInput[] | null | undefined,
) {
  return addresses?.find((address) => address.is_selected) ?? null;
}

export function createDeliveryAddressFromProfile(
  address: ProfileAddress,
): DeliveryAddress | null {
  return createDeliveryAddressFromSavedAddress(address);
}

export function createDeliveryAddressFromSavedAddress(
  address: SavedAddressInput,
): DeliveryAddress | null {
  const [rawLongitude, rawLatitude] = address.location?.coordinates ?? [];
  const latitude = toFiniteNumber(rawLatitude);
  const longitude = toFiniteNumber(rawLongitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return createDeliveryAddress({
    id: address.id,
    address: address.address,
    locationName: address.location_name,
    latitude,
    longitude,
    type: address.type,
  });
}

export function createSelectedDeliveryAddress(
  addresses: SavedAddressInput[] | null | undefined,
): DeliveryAddress | null {
  const selectedAddress = getSelectedSavedAddress(addresses);

  if (!selectedAddress) {
    return null;
  }

  return createDeliveryAddressFromSavedAddress(selectedAddress);
}
