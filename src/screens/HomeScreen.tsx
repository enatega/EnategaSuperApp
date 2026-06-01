import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet, View } from 'react-native';
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
import type { SelectMiniAppFn } from '../apps/registry/homeSections/types';
import { authSession } from '../general/auth/authSession';
import { resetToSharedRoute } from '../general/navigation/rootNavigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SharedStackParamList } from '../general/navigation/navigationTypes';

type Props = {
  onSelectMiniApp?: SelectMiniAppFn;
};

export default function HomeScreen({ onSelectMiniApp: _onSelectMiniApp }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<SharedStackParamList, 'Home'>>();
  const isFocused = useIsFocused();
  const [isLocationPopupVisible, setIsLocationPopupVisible] = useState(false);
  const [locationPopupMode, setLocationPopupMode] = useState<LocationPopupMode>('request');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isSyncingLocation, setIsSyncingLocation] = useState(true);
  const hasHandledInitialRedirectRef = useRef(false);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    void syncLocationPermission({ isInitial: !hasHandledInitialRedirectRef.current });
  }, [isFocused]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && isFocused) {
        void syncLocationPermission({ isInitial: false });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isFocused]);

  async function syncLocationPermission({ isInitial }: { isInitial: boolean }) {
    if (isInitial) {
      setIsSyncingLocation(true);
    }

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
    } finally {
      if (isInitial) {
        setIsSyncingLocation(false);
        void handleInitialDeliveriesRedirect();
      }
    }
  }

  async function handleInitialDeliveriesRedirect() {
    if (hasHandledInitialRedirectRef.current) {
      return;
    }

    hasHandledInitialRedirectRef.current = true;

    const token = await authSession.getAccessToken();

    if (token) {
      resetToSharedRoute('Deliveries');
      return;
    }

    navigation.replace('Auth');
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
        <View style={styles.loaderWrap}>
          {isSyncingLocation ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : null}
        </View>
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
  loaderWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
