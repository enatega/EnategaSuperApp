import apiClient from './apiClient';

const ADDRESS_BASE = '/api/v1/apps/deliveries/profile/address';
const PROFILE_BASE = '/api/v1/apps/deliveries/profile';

export type AddressType = 'HOME' | 'APARTMENT' | 'OFFICE' | 'OTHER';

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

export const addressService = {
  searchPlaces: (input: string) =>
    apiClient.post<Array<{ description: string; place_id: string }>>(
      '/api/v1/maps/places',
      { input },
      { skipAuth: true },
    ),

  getPlaceDetails: (placeId: string) =>
    apiClient.post<{ lat: string; lng: string }>(
      '/api/v1/maps/place-details',
      { placeId },
      { skipAuth: true },
    ),

  getRoutePath: async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) => {
    const response = await apiClient.get<{ path?: [number, number][] }>(
      '/api/v1/maps/route',
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

  getSavedAddresses: async () => {
    const response = await apiClient.get<{
      message: string;
      data: { addresses: SavedAddress[] };
    }>(PROFILE_BASE);

    return response?.data?.addresses ?? [];
  },

  addAddress: (payload: AddressPayload) =>
    apiClient.post<AddressResponse>(ADDRESS_BASE, payload),

  updateAddress: (id: string, payload: AddressPayload) =>
    apiClient.patch<AddressResponse>(`${ADDRESS_BASE}/${id}`, payload),

  selectAddress: (id: string) =>
    apiClient.patch<SelectAddressResponse>(`${ADDRESS_BASE}/${id}/select`),

  deleteAddress: (id: string) =>
    apiClient.delete<void>(`${ADDRESS_BASE}/${id}`),
};
