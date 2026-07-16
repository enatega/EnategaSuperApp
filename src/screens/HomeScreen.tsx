import React, { useEffect, useState } from 'react';
import { AppState, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../general/theme/theme';
import HomeHeader from './home/HomeHeader';
import HomeLocationPermissionPopup, {
  LocationPopupMode,
} from './home/HomeLocationPermissionPopup';
import { useIsFocused } from '@react-navigation/native';
import {
  getLocationPermissionState,
  openAppLocationSettings,
  requestLocationPermission,
} from '../general/utils/locationPermission';
import HomeTravelBannerSection from './home/HomeTravelBannerSection';
import OurServicesSection from './home/OurServicesSection';
import type { SelectMiniAppFn } from '../apps/registry/homeSections/types';
import { HOME_WIDGETS, type RideIntent } from '../apps/registry/generated/appRegistry';

type Props = {
  onSelectMiniApp?: SelectMiniAppFn;
};

export default function HomeScreen({ onSelectMiniApp }: Props) {
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const [isLocationPopupVisible, setIsLocationPopupVisible] = useState(false);
  const [locationPopupMode, setLocationPopupMode] = useState<LocationPopupMode>('request');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    void syncLocationPermission();
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isFocused) {
        void syncLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isFocused]);

  async function syncLocationPermission() {
    try {
      const permission = await getLocationPermissionState();

      if (permission.granted) {
        setIsLocationPopupVisible(false);
        setLocationPopupMode('request');
        return;
      }

      if (permission.blocked) {
        setLocationPopupMode('blocked');
      } else if (permission.undetermined) {
        setLocationPopupMode('request');
      } else {
        setLocationPopupMode('denied');
      }

      setIsLocationPopupVisible(true);
    } catch (error) {
      console.warn('Unable to read location permission state', error);
    }
  }

  async function handleRequestLocation() {
    setIsRequestingLocation(true);

    try {
      const permission = await requestLocationPermission();

      if (permission.granted) {
        setIsLocationPopupVisible(false);
        setLocationPopupMode('request');
        return;
      }

      setLocationPopupMode(permission.blocked ? 'blocked' : 'denied');
      setIsLocationPopupVisible(true);
    } catch (error) {
      console.warn('Unable to request location permission', error);
    } finally {
      setIsRequestingLocation(false);
    }
  }

  function handleDismissLocationPopup() {
    setIsLocationPopupVisible(false);
  }

  async function handleOpenLocationSettings() {
    try {
      await openAppLocationSettings();
    } catch (error) {
      console.warn('Unable to open app settings', error);
    }
  }

  function handleSelectRideOption(rideIntent: RideIntent) {
    onSelectMiniApp?.('rideSharing', {
      screen: 'RideSharingHome',
      params: {
        rideType: rideIntent,
      },
    });
  }

  function handleSelectDeliveryService(shopTypeId: string) {
    if (shopTypeId === 'food-delivery') {
      onSelectMiniApp?.('deliveries');
      return;
    }

    onSelectMiniApp?.('deliveries', {
      screen: 'MultiVendor',
      params: {
        screen: 'MainSeeAllScreen',
        params: {
          initialShopTypeId: shopTypeId,
        },
      },
    });
  }

  function handleSelectTravelBanner() {
    handleSelectRideOption('now');
  }

  const RideOptionsSection = HOME_WIDGETS.rideOptions;
  const DeliveryServicesSection = HOME_WIDGETS.deliveryServices;
  const RecommendedStoresSection = HOME_WIDGETS.recommendedStores;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeader backgroundVariant="solid" />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {RideOptionsSection ? (
            <RideOptionsSection onSelectRideOption={handleSelectRideOption} />
          ) : null}
          {DeliveryServicesSection ? (
            <DeliveryServicesSection onSelectService={handleSelectDeliveryService} />
          ) : null}
          {RecommendedStoresSection ? (
            <RecommendedStoresSection onSelectMiniApp={onSelectMiniApp} />
          ) : null}
          <HomeTravelBannerSection onPress={handleSelectTravelBanner} />
          <OurServicesSection onSelectMiniApp={onSelectMiniApp} />
        </ScrollView>
      </SafeAreaView>

      <HomeLocationPermissionPopup
        visible={isLocationPopupVisible}
        mode={locationPopupMode}
        isLoading={isRequestingLocation}
        onRequestLocation={handleRequestLocation}
        onOpenSettings={handleOpenLocationSettings}
        onDismiss={handleDismissLocationPopup}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
    paddingTop: 0,
  },
});
