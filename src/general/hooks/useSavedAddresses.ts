import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { addressService } from '../api/addressService';
import type { SavedAddress } from '../api/addressService';
import useSyncSelectedSavedAddress from './useSyncSelectedSavedAddress';

type SavedAddressesState = {
  addresses: SavedAddress[];
  isLoading: boolean;
  error: string | null;
};

export default function useSavedAddresses() {
  const [state, setState] = useState<SavedAddressesState>({
    addresses: [],
    isLoading: true,
    error: null,
  });
  useSyncSelectedSavedAddress(state.addresses, state.isLoading);
  const hasFetchedOnce = useRef(false);

  const fetchAddresses = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      const addresses = await addressService.getSavedAddresses();

      setState({
        addresses,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load addresses';

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (hasFetchedOnce.current) {
        fetchAddresses(false);
      } else {
        hasFetchedOnce.current = true;
        fetchAddresses(true);
      }
    }, [fetchAddresses]),
  );

  return {
    ...state,
    refetch: () => fetchAddresses(false),
  };
}
