import React, { useCallback, useEffect, useMemo } from 'react';
import { Image as RNImage, ScrollView, View } from 'react-native';
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
import TopBrandsList from '../../components/HomeTab/TopBrandsList';
import NearbyStoreList from '../../components/HomeTab/NearbyStoreList';
import OffersForYouSection from '../../components/HomeTab/OffersForYouSection';
import MultiVendorDealsSection from '../../components/HomeTab/MultiVendorDealsSection';
import OrderAgain from '../../components/HomeTab/OrderAgain';
import SharedSpecialOffersBanner from '../../../components/specialOffersBanner/SpecialOffersBanner';
import { DiscoveryCategorySkeleton, DiscoveryResultsSkeleton } from '../../../components/discovery';
import { useCartCount } from '../../../hooks/useCart';
import { useMobileBanners } from '../../../hooks';
import useAddressSelectionSheet from '../../../../../general/hooks/useAddressSelectionSheet';
import type { ProfileAddress } from '../../../../../general/api/profileService';
import useSavedAddresses from '../../../../../general/hooks/useSavedAddresses';
import { styles } from './HomeTabStyle';
import useAddress from '../../../../../general/hooks/useAddress';
import useCurrentLocation from '../../../../../general/hooks/useCurrentLocation';
import useSelectSavedAddress from '../../../../../general/hooks/useSelectSavedAddress';
import type { DeliveryBanner } from '../../../api/types';
// import AppSwitcherTopBar from '../../../../../general/components/appSwitch/AppSwitcherTopBar';

type NavProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function HomeTab() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const { data: cartCount } = useCartCount();
  const { data: banners = [], isPending: isBannersPending } = useMobileBanners();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses("deliveries");
  const { selectedAddress, setSelectedAddress } = useAddress();
  const { currentCoordinates, isLoadingCurrentLocation, refreshCurrentLocation } = useCurrentLocation();
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress("deliveries");
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });
  const {
    topBanners,
    stickyBanners,
    middleBanners,
    bottomBanners,
  } = useMemo(() => {
    const sortedBanners = [...banners].sort(
      (firstBanner, secondBanner) =>
        (firstBanner.displayOrder ?? Number.MAX_SAFE_INTEGER) -
        (secondBanner.displayOrder ?? Number.MAX_SAFE_INTEGER),
    );

    const byPlacement = (placement: 'top' | 'sticky' | 'middle' | 'bottom') =>
      sortedBanners.filter(
        (banner: DeliveryBanner) =>
          (banner.placement === placement ||
            (placement === 'top' && !banner.placement)) &&
          banner.isActive !== false,
      );

    return {
      topBanners: byPlacement('top'),
      stickyBanners: byPlacement('sticky'),
      middleBanners: byPlacement('middle'),
      bottomBanners: byPlacement('bottom'),
    };
  }, [banners]);
  const hasSelectedCoordinates =
    typeof selectedAddress?.latitude === 'number' &&
    typeof selectedAddress?.longitude === 'number';
  const hasServerSelectedAddress = useMemo(
    () => addresses.some((address) => address.is_selected),
    [addresses],
  );
  const shouldWaitForInitialDiscovery =
    !hasSelectedCoordinates &&
    !hasServerSelectedAddress &&
    (isAddressesLoading || isLoadingCurrentLocation);

  useEffect(() => {
    if (banners.length === 0) {
      return;
    }

    const imageUrls = banners
      .map((banner) => banner.bannerImageLink?.trim())
      .filter((url): url is string => Boolean(url));

    imageUrls.forEach((url) => {
      void RNImage.prefetch(url);
    });
  }, [banners]);

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

  const handleUseCurrentLocation = useCallback(async () => {
    handleCloseAddressSheet();
    const currentLocation = await refreshCurrentLocation();
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: "deliveries",
      initialLatitude: currentLocation?.latitude,
      initialLongitude: currentLocation?.longitude,
      origin: 'multi-vendor-home'
    });
  }, [handleCloseAddressSheet, navigation, refreshCurrentLocation]);

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

    if (hasSelectedSavedAddress) {
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
        {shouldWaitForInitialDiscovery ? (
          <>
            <DiscoveryCategorySkeleton />
            <DiscoveryResultsSkeleton />
            <DiscoveryResultsSkeleton />
          </>
        ) : (
          <>
            <ShopTypeList />
            <SharedSpecialOffersBanner banners={topBanners} isPending={isBannersPending} />
            <TopBrandsList />
            <NearbyStoreList />
            <OffersForYouSection />
            <MultiVendorDealsSection />
            <SharedSpecialOffersBanner
              banners={stickyBanners}
              isPending={isBannersPending}
              layout="stack"
              maxItems={2}
            />
            <ShopTypeStoreSections />
            <SharedSpecialOffersBanner banners={middleBanners} isPending={isBannersPending} />
            <OrderAgain />
            <SharedSpecialOffersBanner banners={bottomBanners} isPending={isBannersPending} />
          </>
        )}
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
