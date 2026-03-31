import { create } from 'zustand';
import type { AddressType } from '../api/addressService';
import { areDeliveryAddressesEqual } from '../utils/address';

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
  setSelectedAddress: (address) =>
    set((state) => (
      areDeliveryAddressesEqual(state.selectedAddress, address)
        ? state
        : { selectedAddress: address }
    )),
  clearSelectedAddress: () =>
    set((state) => (
      state.selectedAddress === null ? state : { selectedAddress: null }
    )),
}));
