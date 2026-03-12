import apiClient from '../../../general/api/apiClient';

const ADDRESS_BASE = '/api/v1/apps/deliveries/profile/address';

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

  addAddress: (payload: AddressPayload) =>
    apiClient.post<AddressResponse>(ADDRESS_BASE, payload),

  updateAddress: (id: string, payload: AddressPayload) =>
    apiClient.patch<AddressResponse>(`${ADDRESS_BASE}/${id}`, payload),

  deleteAddress: (id: string) =>
    apiClient.delete<void>(`${ADDRESS_BASE}/${id}`),
};
