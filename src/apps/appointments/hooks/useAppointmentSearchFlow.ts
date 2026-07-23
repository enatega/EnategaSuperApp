import { useCallback, useMemo, useState } from 'react';
import { Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { ProfileAddress } from '../../../general/api/profileService';
import { showToast } from '../../../general/components/AppToast';
import useAddress from '../../../general/hooks/useAddress';
import useAddressSelectionSheet from '../../../general/hooks/useAddressSelectionSheet';
import useCurrentLocation from '../../../general/hooks/useCurrentLocation';
import useDebouncedValue from '../../../general/hooks/useDebouncedValue';
import useSavedAddresses from '../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../general/hooks/useSelectSavedAddress';
import type { AppointmentsStackParamList } from '../navigation/types';
import type { AppointmentProvider } from '../api/types';
import {
  useAppointmentNearbyProviders,
  useAppointmentSearchSuggestions,
} from './useDiscoveryQueries';

type NavigationProp = NativeStackNavigationProp<AppointmentsStackParamList>;

export default function useAppointmentSearchFlow() {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation('appointments');
  const { t: tGeneral } = useTranslation('general');
  const { latitude, longitude, selectedAddress, selectedAddressLabel } = useAddress();
  const { refreshCurrentLocation } = useCurrentLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 450);
  const trimmedQuery = searchQuery.trim();
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useSavedAddresses('appointments');
  const { selectSavedAddress, selectingAddressId } =
    useSelectSavedAddress('appointments');
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });
  const suggestionsQuery = useAppointmentSearchSuggestions({ limit: 30 });
  const providersQuery = useAppointmentNearbyProviders(
    {
      latitude,
      longitude,
      limit: 50,
      search: trimmedDebouncedQuery,
    },
    { enabled: trimmedDebouncedQuery.length > 0 },
  );
  const isWaitingForDebounce =
    trimmedQuery.length > 0 && trimmedQuery !== trimmedDebouncedQuery;

  const handleBack = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate('MultiVendor', {
      screen: 'MultiVendorTabs',
      params: { screen: 'MultiVendorTabHome' },
    });
  }, [navigation]);

  const handleProviderPress = useCallback(
    (provider: AppointmentProvider) => {
      Keyboard.dismiss();
      navigation.navigate('MultiVendor', {
        screen: 'MultiVendorDetails',
        params: { provider },
      });
    },
    [navigation],
  );

  const handleSelectAddress = useCallback(
    async (address: ProfileAddress) => {
      try {
        if (!(await selectSavedAddress(address.id))) {
          return;
        }

        void refetchAddresses();
        handleCloseAddressSheet();
      } catch {
        showToast.error(tGeneral('address_select_error'));
      }
    }, [
      handleCloseAddressSheet,
      refetchAddresses,
      selectSavedAddress,
      tGeneral,
    ],
  );

  const handleAddAddress = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressSearch', {
      appPrefix: 'appointments',
      origin: 'multi-vendor-home',
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(async () => {
    handleCloseAddressSheet();
    const location = await refreshCurrentLocation();
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: 'appointments',
      initialLatitude: location?.latitude,
      initialLongitude: location?.longitude,
      origin: 'multi-vendor-home',
    });
  }, [handleCloseAddressSheet, navigation, refreshCurrentLocation]);

  return useMemo(
    () => ({
      addresses,
      handleAddAddress,
      handleBack,
      handleCloseAddressSheet,
      handleOpenAddressSheet,
      handleProviderPress,
      handleSelectAddress,
      handleUseCurrentLocation,
      isAddressSheetVisible,
      isAddressesLoading,
      isSearchActive: trimmedQuery.length > 0,
      isSearchError: providersQuery.isError,
      isSearchLoading: isWaitingForDebounce || providersQuery.isPending,
      isSuggestionsLoading: suggestionsQuery.isPending,
      providers: providersQuery.data ?? [],
      searchQuery,
      selectedAddressId: selectedAddress?.id,
      selectedAddressLabel,
      selectingAddressId,
      setSearchQuery,
      suggestions: suggestionsQuery.data ?? [],
      t,
    }),
    [
      addresses,
      handleAddAddress,
      handleBack,
      handleCloseAddressSheet,
      handleOpenAddressSheet,
      handleProviderPress,
      handleSelectAddress,
      handleUseCurrentLocation,
      isAddressSheetVisible,
      isAddressesLoading,
      isWaitingForDebounce,
      providersQuery.data,
      providersQuery.isError,
      providersQuery.isPending,
      searchQuery,
      selectedAddress?.id,
      selectedAddressLabel,
      selectingAddressId,
      suggestionsQuery.data,
      suggestionsQuery.isPending,
      t,
      trimmedQuery.length,
    ],
  );
}
