import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
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
import { appointmentKeys } from '../../api/queryKeys';
import type {
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
  AppointmentProvider,
  AppointmentShopType,
} from '../../api/types';
import AppointmentsAddressHeader from '../../components/AppointmentsAddressHeader';
import AppointmentsMultiVendorHomeContent from '../../components/home/AppointmentsMultiVendorHomeContent';
import type { AppointmentsStackParamList } from '../../navigation/types';

type NavProp = NativeStackNavigationProp<AppointmentsStackParamList>;

export default function MultiVendorHomeScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const { t: tGeneral } = useTranslation('general');
  const navigation = useNavigation<NavProp>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        refetch(),
        queryClient.refetchQueries({
          queryKey: appointmentKeys.discovery(),
          type: 'active',
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refetch]);

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

  const handleOpenSeeAll = useCallback(
    (
      section:
        | 'categories'
        | 'shopTypeCategories'
        | 'topBrands'
        | 'nearbyProviders'
        | 'orderAgain'
        | 'mostPopular',
      title: string,
      shopTypeId?: string,
      categoryId?: string,
    ) => {
      navigation.navigate('MultiVendor', {
        screen: 'AppointmentsSeeAll',
        params: {
          section,
          title,
          shopTypeId,
          categoryId,
        },
      });
    },
    [navigation],
  );

  const handleCategoriesPress = useCallback(() => {
    handleOpenSeeAll('categories', t('multi_vendor_shop_types_title'));
  }, [handleOpenSeeAll, t]);

  const handleCategoryPress = useCallback(
    (shopType: AppointmentShopType) => {
      handleOpenSeeAll('nearbyProviders', shopType.name, shopType.id);
    },
    [handleOpenSeeAll],
  );

  const handleTopBrandsPress = useCallback(() => {
    handleOpenSeeAll('topBrands', t('multi_vendor_top_brands_title'));
  }, [handleOpenSeeAll, t]);

  const handleNearbyProvidersPress = useCallback(() => {
    handleOpenSeeAll('nearbyProviders', t('multi_vendor_nearby_store_title'));
  }, [handleOpenSeeAll, t]);

  const handleOrderAgainPress = useCallback(() => {
    handleOpenSeeAll('orderAgain', t('multi_vendor_order_again_title'));
  }, [handleOpenSeeAll, t]);

  const handleMostPopularPress = useCallback(() => {
    handleOpenSeeAll('mostPopular', t('multi_vendor_most_popular_title'));
  }, [handleOpenSeeAll, t]);

  const handleOpenProviderDetails = useCallback(
    (provider: AppointmentProvider) => {
      navigation.navigate('MultiVendor', {
        screen: 'MultiVendorDetails',
        params: {
          provider,
        },
      });
    },
    [navigation],
  );

  const handleOpenOrderAgainDetails = useCallback(
    (item: AppointmentOrderAgainItem | AppointmentMostPopularItem) => {
      const provider: AppointmentProvider = {
        storeId: item.storeId,
        vendorId: item.storeId,
        name: item.storeName?.trim() || item.productName,
        logo: item.storeLogo ?? null,
        coverImage: item.storeImage ?? item.productImage ?? null,
        deal: item.deal ?? null,
        dealAmount: item.dealAmount ?? null,
        dealType: item.dealType ?? null,
      };

      navigation.navigate('MultiVendor', {
        screen: 'MultiVendorDetails',
        params: {
          provider,
        },
      });
    },
    [navigation],
  );

  const handleOpenBookings = useCallback(() => {
    navigation.navigate('MultiVendor', {
      screen: 'MultiVendorTabs',
      params: {
        screen: 'MultiVendorTabBookings',
      },
    });
  }, [navigation]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppointmentsAddressHeader
        addresses={addresses}
        onAddAddressPress={handleOpenAddressSheet}
        onAddressPress={handleOpenAddressSheet}
        onNotificationPress={() => {
          navigation.navigate('MultiVendor', {
            screen: 'MultiVendorNotifications',
          });
        }}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={colors.primary}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <AppointmentsMultiVendorHomeContent
          title={t('multi_vendor_home_special_title')}
          body={t('multi_vendor_home_special_body')}
          bookingsLabel={t('multi_vendor_home_bookings_cta')}
          categoriesTitle={t('multi_vendor_shop_types_title')}
          topBrandsTitle={t('multi_vendor_top_brands_title')}
          nearbyProvidersTitle={t('multi_vendor_nearby_store_title')}
          mostPopularTitle={t('multi_vendor_most_popular_title')}
          orderAgainTitle={t('multi_vendor_order_again_title')}
          seeAllLabel={t('multi_vendor_see_all')}
          emptyTitle={t('multi_vendor_home_section_empty_title')}
          topBrandsEmptyMessage={t('multi_vendor_top_brands_empty')}
          nearbyProvidersEmptyMessage={t('multi_vendor_location_stores_empty')}
          mostPopularEmptyMessage={t(
            'multi_vendor_home_section_empty_most_popular',
          )}
          orderAgainEmptyMessage={t('multi_vendor_home_section_empty_order_again')}
          onCategoriesPress={handleCategoriesPress}
          onCategoryPress={handleCategoryPress}
          onTopBrandsPress={handleTopBrandsPress}
          onNearbyProvidersPress={handleNearbyProvidersPress}
          onNearbyProviderPress={handleOpenProviderDetails}
          onMostPopularPress={handleMostPopularPress}
          onMostPopularItemPress={handleOpenOrderAgainDetails}
          onOrderAgainPress={handleOrderAgainPress}
          onOrderAgainItemPress={handleOpenOrderAgainDetails}
          onBookingsPress={handleOpenBookings}
        />
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
    gap: 18,
    paddingVertical: 16,
  },
  screen: {
    flex: 1,
  },
});
