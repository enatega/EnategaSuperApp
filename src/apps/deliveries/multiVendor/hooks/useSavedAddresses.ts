import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useSyncSelectedSavedAddress from '../../hooks/useSyncSelectedSavedAddress';
import { profileService, ProfileAddress } from '../api/profileService';

type SavedAddressesState = {
  addresses: ProfileAddress[];
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
      const response = await profileService.getProfile();

      setState({
        addresses: response?.data?.addresses ?? [],
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
