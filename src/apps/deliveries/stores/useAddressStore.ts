import { create } from 'zustand';
import type { AddressType } from '../api/addressService';

export type DeliveryAddress = {
  id?: string;
  address: string;
  locationName?: string | null;
  latitude: number;
  longitude: number;
  type?: AddressType;
};

type AddressState = {
  selectedAddress: DeliveryAddress | null;
  setSelectedAddress: (address: DeliveryAddress) => void;
  clearSelectedAddress: () => void;
};

export const useAddressStore = create<AddressState>((set) => ({
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  clearSelectedAddress: () => set({ selectedAddress: null }),
}));
