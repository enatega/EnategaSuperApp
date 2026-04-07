import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddressSelectionBottomSheet from '../../../components/AddressSelectionBottomSheet';
import MultiVendorAddressHeader from '../../../components/MultiVendorAddressHeader';
import Button from '../../../../../general/components/Button';
import Header from '../../../../../general/components/Header';
import Text from '../../../../../general/components/Text';
import { showToast } from '../../../../../general/components/AppToast';
import { useAppLogout } from '../../../../../general/hooks/useAppLogout';
import { useTheme } from '../../../../../general/theme/theme';
import { useCartCount } from '../../../hooks/useCart';
import useAddress from '../../../hooks/useAddress';
import useAddressSelectionSheet from '../../../hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../../hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../hooks/useSelectSavedAddress';
import type { DeliveriesStackParamList } from '../../../navigation/types';

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
  const logoutMutation = useAppLogout({
    onError: (error) => {
      showToast.error(
        t('single_vendor_logout_error_title'),
        error?.message ?? t('single_vendor_logout_error_message'),
      );
    },
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

          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Text>{t('single_vendor_home_body')}</Text>
            <Button
              label={t('logout')}
              variant="danger"
              onPress={() => logoutMutation.mutate()}
              isLoading={logoutMutation.isPending}
              disabled={logoutMutation.isPending}
            />
          </View>
        </View>
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
    gap: 20,
    paddingHorizontal: 20,
  },
  infoCard: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 18,
    padding: 18,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    gap: 20,
  },
});
