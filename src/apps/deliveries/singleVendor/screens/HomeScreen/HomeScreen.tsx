import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressSelectionBottomSheet from '../../../components/AddressSelectionBottomSheet';
import MultiVendorAddressHeader from '../../../components/MultiVendorAddressHeader';
import Header from '../../../../../general/components/Header';
import { showToast } from '../../../../../general/components/AppToast';
import { useTheme } from '../../../../../general/theme/theme';
import { useCartCount } from '../../../hooks/useCart';
import useAddress from '../../../hooks/useAddress';
import useAddressSelectionSheet from '../../../hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../../hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../hooks/useSelectSavedAddress';
import type { DeliveriesStackParamList } from '../../../navigation/types';
import SingleVendorCategorySection from '../../components/HomeScreen/SingleVendorCategorySection';
import SingleVendorDealsSection from '../../components/HomeScreen/SingleVendorDealsSection';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<DeliveriesStackParamList>>();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses();
  const { data: cartCount } = useCartCount();
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
    async (address: (typeof addresses)[number]) => {
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
    navigation.navigate('AddressSearch', { origin: 'single-vendor-home' });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressChooseOnMap', { origin: 'single-vendor-home' });
  }, [handleCloseAddressSheet, navigation]);

  const handleCartPress = useCallback(() => {
    navigation.navigate('Cart');
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MultiVendorAddressHeader
          addresses={addresses}
          cartCount={cartCount?.totalItems}
          onAddAddressPress={handleOpenAddressSheet}
          onAddressPress={handleOpenAddressSheet}
          onCartPress={handleCartPress}
        />

        <View style={styles.content}>
          <Header
            title={t('single_vendor_title')}
            subtitle={t('single_vendor_home_subtitle')}
          />
        </View>

        <SingleVendorCategorySection />
        <SingleVendorDealsSection />
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
  content: {
    paddingHorizontal: 20,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
  },
});
