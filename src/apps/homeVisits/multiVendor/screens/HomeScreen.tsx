import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import { showToast } from '../../../../general/components/AppToast';
import useAddress from '../../../../general/hooks/useAddress';
import useAddressSelectionSheet from '../../../../general/hooks/useAddressSelectionSheet';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import { createSelectedDeliveryAddress } from '../../../../general/utils/address';
import { useTheme } from '../../../../general/theme/theme';
import { resetToSharedHome } from '../../../../general/navigation/rootNavigation';
import HomeVisitsAddressHeader from '../../components/HomeVisitsAddressHeader';
import { homeVisitsKeys } from '../../api/queryKeys';
import SingleVendorSpecialOffersBanner from '../../singleVendor/components/HomeScreen/SingleVendorSpecialOffersBanner';
import ActiveServiceCard from '../../singleVendor/components/HomeScreen/ActiveServiceCard';
import DealsSection from '../components/DealsSection';
import MainServicesSection from '../components/MainServicesSection';
import NearbyServicesSection from '../components/NearbyServicesSection';
import ProvidersSection from '../components/ProvidersSection';
import useActiveBooking from '../../hooks/useActiveBooking';
import type { MultiVendorStackParamList } from '../navigation/types';

type Props = Record<string, never>;

export default function MultiVendorHomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { selectedAddress } = useAddress();
  const { data: activeBooking } = useActiveBooking();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses('home-services');
  const { selectSavedAddress, selectingAddressId } =
    useSelectSavedAddress('home-services');
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });

  const resolvedAddress = useMemo(
    () => createSelectedDeliveryAddress(addresses) ?? selectedAddress,
    [addresses, selectedAddress],
  );

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
    navigation.navigate('AddressSearch', {
      origin: 'multi-vendor-home',
      appPrefix: 'home-services',
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate('AddressChooseOnMap', {
      origin: 'multi-vendor-home',
      appPrefix: 'home-services',
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        refetch(),
        queryClient.refetchQueries({
          queryKey: homeVisitsKeys.discovery(),
          type: 'active',
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refetch]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <HomeVisitsAddressHeader
        addresses={addresses}
        horizontalPadding={16}
        leftAccessory={(
          <Pressable
            accessibilityLabel="Back to home"
            accessibilityRole="button"
            onPress={resetToSharedHome}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.82 : 1,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
        )}
        onAddAddressPress={handleOpenAddressSheet}
        onAddressPress={handleOpenAddressSheet}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: activeBooking ? 160 : 28 },
        ]}
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
        <MainServicesSection />
        <SingleVendorSpecialOffersBanner />
        <ProvidersSection
          title={t('multi_vendor_top_centers_title')}
          emptyMessage={t('multi_vendor_top_centers_empty')}
          scope="top-centers"
          latitude={resolvedAddress?.latitude}
          longitude={resolvedAddress?.longitude}
        />
        <DealsSection
          latitude={resolvedAddress?.latitude}
          longitude={resolvedAddress?.longitude}
        />
        <NearbyServicesSection
          latitude={resolvedAddress?.latitude}
          longitude={resolvedAddress?.longitude}
        />
        <ProvidersSection
          title={t('multi_vendor_service_providers_title')}
          emptyMessage={t('multi_vendor_service_providers_empty')}
          scope="service-providers"
          latitude={resolvedAddress?.latitude}
          longitude={resolvedAddress?.longitude}
        />
      </ScrollView>

      {activeBooking ? (
        <View
          pointerEvents="box-none"
          style={[
            styles.activeCardFloatingContainer,
            { bottom: 10 },
          ]}
        >
          <ActiveServiceCard
            booking={activeBooking}
            onPress={() => {
              navigation.navigate('MultiVendorTrackWorker', {
                orderId: activeBooking.orderId,
                source: 'home_active_service',
              });
            }}
          />
        </View>
      ) : null}

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
  backButton: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    elevation: 2,
    height: 44,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    width: 44,
  },
  content: {
    gap: 16,
    paddingBottom: 28,
    paddingTop: 12,
  },
  activeCardFloatingContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 20,
  },
  screen: {
    flex: 1,
  },
});
