import apiClient from "./apiClient";
import type { ProfileAppPrefix } from "./profileService";

function getProfileBase(appPrefix: ProfileAppPrefix) {
  return `/api/v1/apps/${appPrefix}/profile`;
}

function getAddressBase(appPrefix: ProfileAppPrefix) {
  return `/api/v1/apps/${appPrefix}/profile/address`;
}

export type AddressType = "HOME" | "APARTMENT" | "OFFICE" | "OTHER";

export type AddressPayload = {
  address: string;
  latitude: number;
  longitude: number;
  type: AddressType;
  location_name: string;
};

export type AddressResponse = {
  address: string;
  latitude: number;
  longitude: number;
  type: AddressType;
  location_name: string;
};

export type SavedAddress = {
  id: string;
  user_id: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  location_name: string | null;
  type: AddressType;
  is_selected: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SelectAddressResponse = {
  message: string;
  data: SavedAddress;
};

export type DeliveryAddress = {
  id?: string;
  address: string;
  locationName?: string | null;
  latitude: number;
  longitude: number;
  type?: AddressType;
};

export type RecentAddressSearch = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
  latitude: number;
  longitude: number;
};

// Factory function for dynamic address CRUD operations (requires appPrefix)
export function createAddressService(appPrefix: ProfileAppPrefix) {
  const addressBase = getAddressBase(appPrefix);
  const profileBase = getProfileBase(appPrefix);

  return {
    getSavedAddresses: async () => {
      const response = await apiClient.get<{
        message: string;
        data: { addresses: SavedAddress[] };
      }>(profileBase);
      return response?.data?.addresses ?? [];
    },
    addAddress: (payload: AddressPayload) =>
      apiClient.post<AddressResponse>(addressBase, payload),
    updateAddress: (id: string, payload: AddressPayload) =>
      apiClient.patch<AddressResponse>(`${addressBase}/${id}`, payload),
    selectAddress: (id: string) =>
      apiClient.patch<SelectAddressResponse>(`${addressBase}/${id}/select`),
    deleteAddress: (id: string) =>
      apiClient.delete<void>(`${addressBase}/${id}`),
  };
}

// Main service object
export const addressService = {
  searchPlaces: (input: string) =>
    apiClient.post<Array<{ description: string; place_id: string }>>(
      "/api/v1/maps/places",
      { input },
      { skipAuth: true },
    ),

  getPlaceDetails: (placeId: string) =>
    apiClient.post<{ lat: string; lng: string }>(
      "/api/v1/maps/place-details",
      { placeId },
      { skipAuth: true },
    ),

  getRoutePath: async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) => {
    const response = await apiClient.get<{ path?: [number, number][] }>(
      "/api/v1/maps/route",
      {
        originLat: origin.lat,
        originLng: origin.lng,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
      },
      { skipAuth: true },
    );

    if (!Array.isArray(response.path)) {
      return [];
    }

    return response.path.map(([latitude, longitude]) => ({
      latitude,
      longitude,
    }));
  },

  // Address CRUD methods (require appPrefix)
  getSavedAddresses: (appPrefix: ProfileAppPrefix) =>
    createAddressService(appPrefix).getSavedAddresses(),

  addAddress: (appPrefix: ProfileAppPrefix, payload: AddressPayload) =>
    createAddressService(appPrefix).addAddress(payload),

  updateAddress: (
    appPrefix: ProfileAppPrefix,
    id: string,
    payload: AddressPayload,
  ) => createAddressService(appPrefix).updateAddress(id, payload),

  selectAddress: (appPrefix: ProfileAppPrefix, id: string) =>
    createAddressService(appPrefix).selectAddress(id),

  deleteAddress: (appPrefix: ProfileAppPrefix, id: string) =>
    createAddressService(appPrefix).deleteAddress(id),
};
