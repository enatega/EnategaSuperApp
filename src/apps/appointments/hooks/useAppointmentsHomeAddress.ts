import { useCallback, useEffect } from 'react';
import * as Location from 'expo-location';
import type { ProfileAddress } from '../../../general/api/profileService';
import { showToast } from '../../../general/components/AppToast';
import useAddress from '../../../general/hooks/useAddress';
import useAddressSelectionSheet from '../../../general/hooks/useAddressSelectionSheet';
import useCurrentLocation from '../../../general/hooks/useCurrentLocation';
import useSavedAddresses from '../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../general/hooks/useSelectSavedAddress';

type Params = {
  currentLocationFallback: string;
  selectedLocationFallback: string;
  selectError: string;
};

export default function useAppointmentsHomeAddress({
  currentLocationFallback,
  selectedLocationFallback,
  selectError,
}: Params) {
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses('appointments');
  const { selectedAddress, setSelectedAddress } = useAddress();
  const { currentCoordinates, refreshCurrentLocation } = useCurrentLocation();
  const { selectSavedAddress, selectingAddressId } =
    useSelectSavedAddress('appointments');
  const sheet = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });

  const selectAddress = useCallback(
    async (address: ProfileAddress) => {
      try {
        const isSelected = await selectSavedAddress(address.id);
        if (!isSelected) return;
        void refetch();
        sheet.close();
      } catch {
        showToast.error(selectError);
      }
    },
    [refetch, selectError, selectSavedAddress, sheet],
  );

  useEffect(() => {
    if (!currentCoordinates || isAddressesLoading) return;
    if (selectedAddress?.id && selectedAddress.id !== 'current-location') return;

    const hasSelectedSavedAddress = addresses.some(
      (address) => address.is_selected,
    );
    if (hasSelectedSavedAddress && selectedAddress?.id !== 'current-location') {
      return;
    }
    if (
      selectedAddress?.id === 'current-location' &&
      selectedAddress.latitude === currentCoordinates.latitude &&
      selectedAddress.longitude === currentCoordinates.longitude
    ) {
      return;
    }

    let isMounted = true;
    const hydrateCurrentLocationAddress = async () => {
      try {
        const [result] = await Location.reverseGeocodeAsync(currentCoordinates);
        const locationName =
          result?.district ||
          result?.subregion ||
          result?.city ||
          result?.name ||
          currentLocationFallback;
        const resolvedAddress =
          [
            result?.streetNumber,
            result?.street,
            result?.city,
            result?.region,
            result?.country,
          ]
            .filter(Boolean)
            .join(', ') || selectedLocationFallback;
        if (!isMounted) return;
        setSelectedAddress({
          id: 'current-location',
          locationName,
          address: resolvedAddress,
          latitude: currentCoordinates.latitude,
          longitude: currentCoordinates.longitude,
        });
      } catch {
        if (!isMounted) return;
        setSelectedAddress({
          id: 'current-location',
          locationName: currentLocationFallback,
          address: selectedLocationFallback,
          latitude: currentCoordinates.latitude,
          longitude: currentCoordinates.longitude,
        });
      }
    };

    void hydrateCurrentLocationAddress();
    return () => {
      isMounted = false;
    };
  }, [
    addresses,
    currentCoordinates,
    currentLocationFallback,
    isAddressesLoading,
    selectedAddress,
    selectedLocationFallback,
    setSelectedAddress,
  ]);

  return {
    addresses,
    isAddressesLoading,
    refetch,
    refreshCurrentLocation,
    selectedAddress,
    selectingAddressId,
    selectAddress,
    isAddressSheetVisible: sheet.isVisible,
    openAddressSheet: sheet.open,
    closeAddressSheet: sheet.close,
  };
}
