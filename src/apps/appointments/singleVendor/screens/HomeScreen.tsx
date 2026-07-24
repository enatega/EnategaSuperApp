import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentOrderAgainItem,
  AppointmentShopType,
} from '../../api/types';
import AppointmentsAddressHeader from '../../components/AppointmentsAddressHeader';
import useAppointmentsHomeAddress from '../../hooks/useAppointmentsHomeAddress';
import type { AppointmentsStackParamList } from '../../navigation/types';
import { navigateToActiveAppointmentsTab } from '../../navigation/modeNavigation';
import SingleVendorHomeContent from '../components/SingleVendorHomeContent';
import { singleVendorAppointmentKeys } from '../api/queryKeys';
import { useSingleVendorStore } from '../hooks/useSingleVendorDiscovery';

type Navigation = NativeStackNavigationProp<AppointmentsStackParamList>;

export default function SingleVendorHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const { t: tGeneral } = useTranslation('general');
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();
  const storeQuery = useSingleVendorStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const address = useAppointmentsHomeAddress({
    currentLocationFallback: tGeneral(
      'address_selector_use_current_location',
    ),
    selectedLocationFallback: tGeneral('address_selected_location'),
    selectError: tGeneral('address_select_error'),
  });
  const storeId = storeQuery.data?.storeId ?? '';
  const storeName = storeQuery.data?.name ?? t('single_vendor_label');

  const openServices = useCallback(
    (serviceId?: string) => {
      if (!storeId) return;
      navigation.navigate('SingleVendor', {
        screen: 'Services',
        params: {
          storeId,
          title: storeName,
          initialServiceId: serviceId,
        },
      });
    },
    [navigation, storeId, storeName],
  );

  const handleServicePress = useCallback(
    (item: AppointmentOrderAgainItem) => openServices(item.productId),
    [openServices],
  );

  const handleServiceTypePress = useCallback(
    (_item: AppointmentShopType) => openServices(),
    [openServices],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        address.refetch(),
        queryClient.refetchQueries({
          queryKey: singleVendorAppointmentKeys.home(),
          type: 'active',
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [address, queryClient]);

  const handleAddAddress = useCallback(() => {
    address.closeAddressSheet();
    navigation.navigate('AddressSearch', {
      appPrefix: 'appointments',
      origin: 'single-vendor-home',
    });
  }, [address, navigation]);

  const handleUseCurrentLocation = useCallback(async () => {
    address.closeAddressSheet();
    const currentLocation = await address.refreshCurrentLocation();
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: 'appointments',
      initialLatitude: currentLocation?.latitude,
      initialLongitude: currentLocation?.longitude,
      origin: 'single-vendor-home',
    });
  }, [address, navigation]);

  const handleOpenBookings = useCallback(() => {
    navigateToActiveAppointmentsTab(navigation, 'bookings');
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppointmentsAddressHeader
        addresses={address.addresses}
        onAddAddressPress={address.openAddressSheet}
        onAddressPress={address.openAddressSheet}
        onNotificationPress={() =>
          navigation.navigate('AppointmentNotifications')
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void handleRefresh()}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <SingleVendorHomeContent
          title={t('single_vendor_home_special_title')}
          body={t('single_vendor_home_special_body')}
          bookingsLabel={t('single_vendor_home_bookings_cta')}
          serviceTypesTitle={t('single_vendor_service_types_title')}
          topServicesTitle={t('single_vendor_top_services_title')}
          dealsTitle={t('single_vendor_deals_title')}
          orderAgainTitle={t('single_vendor_order_again_title')}
          seeAllLabel={t('single_vendor_see_all')}
          emptyTitle={t('single_vendor_section_empty_title')}
          emptyMessage={t('single_vendor_section_empty_message')}
          onServiceTypePress={handleServiceTypePress}
          onServicePress={handleServicePress}
          onBookingsPress={handleOpenBookings}
          onSeeAllServicesPress={() => openServices()}
        />
      </ScrollView>
      <AddressSelectionBottomSheet
        addresses={address.addresses}
        isLoading={address.isAddressesLoading}
        isVisible={address.isAddressSheetVisible}
        onAddAddress={handleAddAddress}
        onClose={address.closeAddressSheet}
        onSelectAddress={address.selectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={address.selectingAddressId}
        selectedAddressId={address.selectedAddress?.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    paddingVertical: 16,
  },
  screen: {
    flex: 1,
  },
});
