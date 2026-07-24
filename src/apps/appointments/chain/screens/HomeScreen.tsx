import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
  AppointmentProvider,
} from '../../api/types';
import AppointmentsAddressHeader from '../../components/AppointmentsAddressHeader';
import useAppointmentsHomeAddress from '../../hooks/useAppointmentsHomeAddress';
import type { AppointmentsStackParamList } from '../../navigation/types';
import { chainAppointmentKeys } from '../api/queryKeys';
import ChainHomeContent from '../components/ChainHomeContent';

type Navigation = NativeStackNavigationProp<AppointmentsStackParamList>;

export default function ChainHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const { t: tGeneral } = useTranslation('general');
  const navigation = useNavigation<Navigation>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const address = useAppointmentsHomeAddress({
    currentLocationFallback: tGeneral(
      'address_selector_use_current_location',
    ),
    selectedLocationFallback: tGeneral('address_selected_location'),
    selectError: tGeneral('address_select_error'),
  });

  const handleOpenBranch = useCallback(
    (provider: AppointmentProvider) => {
      navigation.navigate('Chain', {
        screen: 'ChainDetails',
        params: { provider },
      });
    },
    [navigation],
  );

  const handleOpenService = useCallback(
    (item: AppointmentMostPopularItem | AppointmentOrderAgainItem) => {
      navigation.navigate('Chain', {
        screen: 'Services',
        params: {
          storeId: item.storeId,
          title: item.storeName?.trim() || item.productName,
          initialServiceId: item.productId,
        },
      });
    },
    [navigation],
  );

  const handleOpenBranches = useCallback(() => {
    navigation.navigate('Chain', {
      screen: 'ChainTabs',
      params: { screen: 'ChainTabSearch' },
    });
  }, [navigation]);

  const handleOpenBookings = useCallback(() => {
    navigation.navigate('Chain', {
      screen: 'ChainTabs',
      params: { screen: 'ChainTabBookings' },
    });
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        address.refetch(),
        queryClient.refetchQueries({
          queryKey: chainAppointmentKeys.home(),
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
      origin: 'chain-home',
    });
  }, [address, navigation]);

  const handleUseCurrentLocation = useCallback(async () => {
    address.closeAddressSheet();
    const currentLocation = await address.refreshCurrentLocation();
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: 'appointments',
      initialLatitude: currentLocation?.latitude,
      initialLongitude: currentLocation?.longitude,
      origin: 'chain-home',
    });
  }, [address, navigation]);

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
        <ChainHomeContent
          latitude={address.selectedAddress?.latitude}
          longitude={address.selectedAddress?.longitude}
          title={t('chain_home_special_title')}
          body={t('chain_home_special_body')}
          bookingsLabel={t('chain_home_bookings_cta')}
          branchesTitle={t('chain_home_branches_title')}
          topServicesTitle={t('chain_home_top_services_title')}
          orderAgainTitle={t('chain_home_order_again_title')}
          seeAllLabel={t('chain_home_see_all')}
          emptyTitle={t('chain_home_empty_title')}
          branchesEmptyMessage={t('chain_branches_empty')}
          topServicesEmptyMessage={t('chain_home_top_services_empty')}
          orderAgainEmptyMessage={t('chain_home_order_again_empty')}
          onBookingsPress={handleOpenBookings}
          onBranchPress={handleOpenBranch}
          onBranchesPress={handleOpenBranches}
          onServicePress={handleOpenService}
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
