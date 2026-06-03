import React, { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import HomeLocationPermissionPopup, {
  type LocationPopupMode,
} from './HomeLocationPermissionPopup';
import {
  getLocationPermissionState,
  openAppLocationSettings,
  requestLocationPermission,
} from '../../general/utils/locationPermission';

export default function SharedLocationPermissionGate() {
  const [isLocationPopupVisible, setIsLocationPopupVisible] = useState(false);
  const [locationPopupMode, setLocationPopupMode] =
    useState<LocationPopupMode>('request');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  useEffect(() => {
    void syncLocationPermission();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void syncLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
    <HomeLocationPermissionPopup
      visible={isLocationPopupVisible}
      mode={locationPopupMode}
      isLoading={isRequestingLocation}
      onRequestLocation={handleRequestLocation}
      onOpenSettings={handleOpenLocationSettings}
      onDismiss={handleDismissLocationPopup}
    />
  );
}
