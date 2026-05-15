import React, { useCallback, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import { showToast } from '../../../../../general/components/AppToast';
import AddressSelectionBottomSheet from '../../../../../general/components/address/AddressSelectionBottomSheet';
import MultiVendorAddressHeader from '../../../components/MultiVendorAddressHeader';
import type { DeliveriesStackParamList } from '../../../navigation/types';
import ShopTypeList from '../../components/HomeTab/ShopTypeList';
import ShopTypeStoreSections from '../../components/HomeTab/ShopTypeStoreSections';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import TopBrandsList from '../../components/HomeTab/TopBrandsList';
import NearbyStoreList from '../../components/HomeTab/NearbyStoreList';
import MultiVendorDealsSection from '../../components/HomeTab/MultiVendorDealsSection';
import OrderAgain from '../../components/HomeTab/OrderAgain';
import { useCartCount } from '../../../hooks/useCart';
import useAddressSelectionSheet from '../../../../../general/hooks/useAddressSelectionSheet';
import type { ProfileAddress } from '../../../../../general/api/profileService';
import useSavedAddresses from '../../../../../general/hooks/useSavedAddresses';
import { styles } from './HomeTabStyle';
import useAddress from '../../../../../general/hooks/useAddress';
import useCurrentLocation from '../../../../../general/hooks/useCurrentLocation';
import useSelectSavedAddress from '../../../../../general/hooks/useSelectSavedAddress';
// import AppSwitcherTopBar from '../../../../../general/components/appSwitch/AppSwitcherTopBar';

type NavProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function HomeTab() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const { data: cartCount } = useCartCount();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses("deliveries");
  const { selectedAddress, setSelectedAddress } = useAddress();
  const { currentCoordinates } = useCurrentLocation();
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress("deliveries");
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
        showToast.error(t('address_select_error'));
      }
    },
    [handleCloseAddressSheet, refetch, selectSavedAddress, t],
  );

  const handleAddAddressPress = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressSearch', {
      appPrefix: "deliveries",
      origin: 'multi-vendor-home'
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: "deliveries",
      origin: 'multi-vendor-home'
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

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
          t('address_selector_use_current_location');
        const addressParts = [
          result?.streetNumber,
          result?.street,
          result?.city,
          result?.region,
          result?.country,
        ]
          .filter(Boolean)
          .join(', ');
        const resolvedAddress = addressParts || locationName || t('address_selected_location');

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
          locationName: t('address_selector_use_current_location'),
          address: t('address_selected_location'),
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
    t,
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* <AppSwitcherTopBar activeKey="deliveries" /> */}
      <MultiVendorAddressHeader
        includeTopInset
        addresses={addresses}
        onAddAddressPress={handleOpenAddressSheet}
        onAddressPress={handleOpenAddressSheet}
        cartCount={cartCount?.totalItems}
        onCartPress={handleCartPress}
      />
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ShopTypeList />
        <MultiVendorSpecialOffers />
        <TopBrandsList />
        <NearbyStoreList />
        <MultiVendorDealsSection />
        <ShopTypeStoreSections />
        <OrderAgain />
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
