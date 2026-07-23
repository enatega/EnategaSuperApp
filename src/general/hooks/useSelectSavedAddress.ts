import { useCallback, useRef, useState } from 'react';
import { addressService } from '../api/addressService';
import type { SavedAddress } from '../api/addressService';
import { createDeliveryAddressFromSavedAddress } from '../utils/address';
import useAddress from './useAddress';
import { ProfileAppPrefix } from '../api/profileService';

function isRecoverableAppointmentsSelectError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    (message.includes('/profile/address') && message.includes('/select')) ||
    message.includes('pending is_selected migration') ||
    message.includes('column generalbookingsaddressentity.is_selected does not exist') ||
    message.includes('column') && message.includes('is_selected') && message.includes('does not exist')
  );
}

function findSavedAddress(addresses: SavedAddress[], addressId: string) {
  return addresses.find((address) => address.id === addressId) ?? null;
}

export default function useSelectSavedAddress(appPrefix: ProfileAppPrefix) {
  const { selectedAddress, setSelectedAddress } = useAddress();
  const pendingAddressIdRef = useRef<string | null>(null);
  const [selectingAddressId, setSelectingAddressId] = useState<string | null>(
    null,
  );

  const selectSavedAddress = useCallback(
    async (addressId: string) => {
      if (!addressId) {
        return false;
      }

      if (selectedAddress?.id === addressId) {
        return true;
      }

      if (pendingAddressIdRef.current) {
        return false;
      }

      pendingAddressIdRef.current = addressId;
      setSelectingAddressId(addressId);

      try {
        let nextSavedAddress: SavedAddress | null = null;

        try {
          const response = await addressService.selectAddress(appPrefix, addressId);
          nextSavedAddress = response.data;
        } catch (error) {
          if (
            !(
              appPrefix === 'appointments' &&
              isRecoverableAppointmentsSelectError(error)
            )
          ) {
            throw error;
          }

          const savedAddresses = await addressService.getSavedAddresses(appPrefix);
          nextSavedAddress = findSavedAddress(savedAddresses, addressId);

          if (!nextSavedAddress) {
            throw error;
          }
        }

        const nextAddress = createDeliveryAddressFromSavedAddress(nextSavedAddress);

        if (!nextAddress) {
          throw new Error('Selected address is missing valid coordinates.');
        }

        setSelectedAddress(nextAddress);
        return true;
      } finally {
        pendingAddressIdRef.current = null;
        setSelectingAddressId(null);
      }
    },
    [selectedAddress?.id, setSelectedAddress],
  );

  return {
    selectSavedAddress,
    selectingAddressId,
  };
}
