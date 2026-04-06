import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import { showToast } from '../../../../../general/components/AppToast';
import AddressSelectionBottomSheet from '../../../components/AddressSelectionBottomSheet';
import MultiVendorAddressHeader from '../../../components/MultiVendorAddressHeader';
import type { DeliveriesStackParamList } from '../../../navigation/types';
import ShopTypeList from '../../components/HomeTab/ShopTypeList';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import TopBrandsList from '../../components/HomeTab/TopBrandsList';
import NearbyStoreList from '../../components/HomeTab/NearbyStoreList';
import Deals from '../../components/HomeTab/Deals';
import OrderAgain from '../../components/HomeTab/OrderAgain';
import { useCartCount } from '../../../hooks/useCart';
import useAddressSelectionSheet from '../../../hooks/useAddressSelectionSheet';
import type { ProfileAddress } from '../../../account/api/profileService';
import useSavedAddresses from '../../../hooks/useSavedAddresses';
import { styles } from './HomeTabStyle';
import useAddress from '../../../hooks/useAddress';
import useSelectSavedAddress from '../../../hooks/useSelectSavedAddress';

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
  } = useSavedAddresses();
  const { selectedAddress } = useAddress();
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress();
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
    navigation.navigate('AddressSearch', { origin: 'multi-vendor-home' });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressChooseOnMap', { origin: 'multi-vendor-home' });
  }, [handleCloseAddressSheet, navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      >
        <MultiVendorAddressHeader
          addresses={addresses}
          onAddAddressPress={handleOpenAddressSheet}
          onAddressPress={handleOpenAddressSheet}
          cartCount={cartCount?.totalItems}
          onCartPress={handleCartPress}
        />
        <MultiVendorSpecialOffers />
        <ShopTypeList />
        <TopBrandsList />
        <NearbyStoreList />
        <Deals />
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
    </>
  );
}
