import { useCallback, useRef, useState } from 'react';
import { addressService } from '../api/addressService';
import { createDeliveryAddressFromSavedAddress } from '../utils/address';
import useAddress from './useAddress';
import { ProfileAppPrefix } from '../api/profileService';

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
        const response = await addressService.selectAddress(appPrefix, addressId);
        const nextAddress = createDeliveryAddressFromSavedAddress(
          response.data,
        );

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
