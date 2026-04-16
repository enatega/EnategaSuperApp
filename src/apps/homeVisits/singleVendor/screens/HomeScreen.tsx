import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import HomeVisitsAddressHeader from '../../components/HomeVisitsAddressHeader';
import Header from '../../../../general/components/Header';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import useAddress from '../../../../general/hooks/useAddress';
import useAddressSelectionSheet from '../../../../general/hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import SingleVendorCategorySection from '../components/HomeScreen/SingleVendorCategorySection';
import SingleVendorDealsSection from '../components/HomeScreen/SingleVendorDealsSection';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';

type Props = Record<string, never>;

export default function SingleVendorHomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
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
        <HomeVisitsAddressHeader
          addresses={addresses}
          onAddAddressPress={handleOpenAddressSheet}
          onAddressPress={handleOpenAddressSheet}
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
