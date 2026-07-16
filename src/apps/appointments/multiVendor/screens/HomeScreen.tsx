import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import { showToast } from '../../../../general/components/AppToast';
import type { ProfileAddress } from '../../../../general/api/profileService';
import useAddress from '../../../../general/hooks/useAddress';
import useAddressSelectionSheet from '../../../../general/hooks/useAddressSelectionSheet';
import useCurrentLocation from '../../../../general/hooks/useCurrentLocation';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import { useTheme } from '../../../../general/theme/theme';
import AppointmentsAddressHeader from '../../components/AppointmentsAddressHeader';
import type { AppointmentsStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<AppointmentsStackParamList>;

export default function MultiVendorHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const { t: tGeneral } = useTranslation('general');
  const navigation = useNavigation<NavProp>();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses('appointments');
  const { selectedAddress, setSelectedAddress } = useAddress();
  const { currentCoordinates, refreshCurrentLocation } = useCurrentLocation();
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

  const handleSelectAddress = useCallback(
    async (address: ProfileAddress) => {
      try {
        const isSelected = await selectSavedAddress(address.id);

        if (!isSelected) {
          return;
        }

        void refetch();
        handleCloseAddressSheet();
      } catch {
        showToast.error(tGeneral('address_select_error'));
      }
    },
    [handleCloseAddressSheet, refetch, selectSavedAddress, tGeneral],
  );

  const handleAddAddressPress = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressSearch', {
      appPrefix: 'appointments',
      origin: 'multi-vendor-home',
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(async () => {
    handleCloseAddressSheet();
    const currentLocation = await refreshCurrentLocation();
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: 'appointments',
      initialLatitude: currentLocation?.latitude,
      initialLongitude: currentLocation?.longitude,
      origin: 'multi-vendor-home',
    });
  }, [handleCloseAddressSheet, navigation, refreshCurrentLocation]);

  useEffect(() => {
    if (!currentCoordinates || isAddressesLoading) {
      return;
    }

    if (selectedAddress?.id && selectedAddress.id !== 'current-location') {
      return;
    }

    const hasSelectedSavedAddress = addresses.some((address) => address.is_selected);

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
          tGeneral('address_selector_use_current_location');
        const addressParts = [
          result?.streetNumber,
          result?.street,
          result?.city,
          result?.region,
          result?.country,
        ]
          .filter(Boolean)
          .join(', ');
        const resolvedAddress =
          addressParts ||
          locationName ||
          tGeneral('address_selected_location');

        if (!isMounted) {
          return;
        }

        setSelectedAddress({
          id: 'current-location',
          locationName,
          address: resolvedAddress,
          latitude: currentCoordinates.latitude,
          longitude: currentCoordinates.longitude,
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setSelectedAddress({
          id: 'current-location',
          locationName: tGeneral('address_selector_use_current_location'),
          address: tGeneral('address_selected_location'),
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
    isAddressesLoading,
    selectedAddress,
    setSelectedAddress,
    tGeneral,
  ]);

  const contentCards = useMemo(
    () => [
      {
        key: 'intro',
        title: t('multi_vendor_home_intro_title'),
        body: t('multi_vendor_home_intro_body'),
      },
      {
        key: 'next-step',
        title: t('multi_vendor_home_next_step_title'),
        body: t('multi_vendor_home_next_step_body'),
      },
    ],
    [t],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppointmentsAddressHeader
        addresses={addresses}
        onAddAddressPress={handleOpenAddressSheet}
        onAddressPress={handleOpenAddressSheet}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      </ScrollView>

      <AddressSelectionBottomSheet
        addresses={addresses}
        isLoading={isAddressesLoading}
        isVisible={isAddressSheetVisible}
        onAddAddress={handleAddAddressPress}
        onClose={handleCloseAddressSheet}
        onSelectAddress={handleSelectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={selectingAddressId}
        selectedAddressId={selectedAddress?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
    padding: 16,
  },
  screen: {
    flex: 1,
  },
});
