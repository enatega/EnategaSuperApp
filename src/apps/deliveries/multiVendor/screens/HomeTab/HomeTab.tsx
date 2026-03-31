import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import { showToast } from '../../../../../general/components/AppToast';
import MultiVendorAddressHeader from '../../components/HomeTab/AddressHeader';
import AddressSelectionBottomSheet from '../../components/addressSelection/AddressSelectionBottomSheet';
import ShopTypeList from '../../components/HomeTab/ShopTypeList';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import TopBrandsList from '../../components/HomeTab/TopBrandsList';
import NearbyStoreList from '../../components/HomeTab/NearbyStoreList';
import Deals from '../../components/HomeTab/Deals';
import OrderAgain from '../../components/HomeTab/OrderAgain';
import type { ProfileAddress } from '../../api/profileService';
import useSavedAddresses from '../../hooks/useSavedAddresses';
import { styles } from './HomeTabStyle';
import type { MultiVendorStackParamList } from '../../navigation/types';
import useAddress from '../../../hooks/useAddress';
import useSelectSavedAddress from '../../../hooks/useSelectSavedAddress';

type NavProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function HomeTab() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);
  const hasAutoOpenedAddressSheetRef = useRef(false);
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses();
  const { selectedAddress } = useAddress();
  const { selectSavedAddress } = useSelectSavedAddress();

  useFocusEffect(
    useCallback(() => {
      hasAutoOpenedAddressSheetRef.current = false;
    }, []),
  );

  useEffect(() => {
    if (isAddressesLoading || isAddressSheetVisible) {
      return;
    }

    if (addresses.length > 0) {
      hasAutoOpenedAddressSheetRef.current = false;
      return;
    }

    if (hasAutoOpenedAddressSheetRef.current) {
      return;
    }

    hasAutoOpenedAddressSheetRef.current = true;
    setIsAddressSheetVisible(true);
  }, [addresses.length, isAddressSheetVisible, isAddressesLoading]);

  const handleOpenAddressSheet = useCallback(() => {
    setIsAddressSheetVisible(true);
  }, []);

  const handleCloseAddressSheet = useCallback(() => {
    setIsAddressSheetVisible(false);
  }, []);

  const handleSelectAddress = useCallback(
    async (address: ProfileAddress) => {
      try {
        const isSelected = await selectSavedAddress(address.id);

        if (!isSelected) {
          return;
        }

        void refetch();
        setIsAddressSheetVisible(false);
      } catch {
        showToast.error(t('address_select_error'));
      }
    },
    [refetch, selectSavedAddress, t],
  );

  const handleAddAddressPress = useCallback(() => {
    setIsAddressSheetVisible(false);
    navigation.navigate('AddressSearch', { origin: 'home-header' });
  }, [navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    setIsAddressSheetVisible(false);
    navigation.navigate('AddressChooseOnMap', { origin: 'home-header' });
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
        selectedAddressId={selectedAddress?.id}
      />
    </>
  );
}
