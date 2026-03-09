import React, { useEffect, useState } from 'react';
import { AppState, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../general/theme/theme';
import { mockImages } from '../general/utils/mockImages';
import { serviceTypeIcons } from '../general/assets/images';
import HomeHeader from './home/HomeHeader';
import HomeLocationPermissionPopup, {
  LocationPopupMode,
} from './home/HomeLocationPermissionPopup';
import OurServicesSection from './home/OurServicesSection';
import ServiceTypeSection from './home/ServiceTypeSection';
import RecommendedSection from './home/RecommendedSection';
import { MiniAppId } from '../general/utils/constants';
import { useIsFocused } from '@react-navigation/native';
import {
  getLocationPermissionState,
  openAppLocationSettings,
  requestLocationPermission,
} from '../general/utils/locationPermission';

type Props = {
  onSelectMiniApp?: (id: MiniAppId) => void;
};

export default function HomeScreen({ onSelectMiniApp }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');
  const { t: tDeliveries } = useTranslation('deliveries');
  const isFocused = useIsFocused();
  const [isLocationPopupVisible, setIsLocationPopupVisible] = useState(false);
  const [locationPopupMode, setLocationPopupMode] = useState<LocationPopupMode>('request');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const serviceTypes = [
    {
      id: 'single',
      title: tDeliveries('type_single_vendor_title'),
      description: tDeliveries('type_single_vendor_desc'),
      icon: serviceTypeIcons.singleStore,
    },
    {
      id: 'marketplace',
      title: tDeliveries('type_marketplace_title'),
      description: tDeliveries('type_marketplace_desc'),
      icon: serviceTypeIcons.multiStore,
    },
    {
      id: 'chain',
      title: tDeliveries('type_chain_title'),
      description: tDeliveries('type_chain_desc'),
      icon: serviceTypeIcons.chainStore,
    },
  ];

  const recommendations = [
    {
      id: 'rec-1',
      title: t('recommended_name'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: mockImages.recommendationOne,
    },
    {
      id: 'rec-2',
      title: t('recommended_name'),
      rating: 4.1,
      reviews: 5000,
      price: 25,
      image: mockImages.recommendationTwo,
    },
  ];

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeader backgroundVariant="solid" />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <OurServicesSection onSelectMiniApp={onSelectMiniApp} />
          <ServiceTypeSection items={serviceTypes} />
          <RecommendedSection items={recommendations} />
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
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 18,
    paddingTop: 8,
  },
});
