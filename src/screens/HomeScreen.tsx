import React, { useEffect, useState } from 'react';
import { AppState, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../general/theme/theme';
import HomeHeader from './home/HomeHeader';
import HomeLocationPermissionPopup, {
  LocationPopupMode,
} from './home/HomeLocationPermissionPopup';
import OurServicesSection from './home/OurServicesSection';
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeader backgroundVariant="solid" />
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <OurServicesSection onSelectMiniApp={onSelectMiniApp} />
          <RecommendedSection  />
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
