import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import {
  getLocationPermissionState,
  requestLocationPermission,
} from '../utils/locationPermission';

export type CurrentCoordinates = {
  latitude: number;
  longitude: number;
};

export default function useCurrentLocation() {
  const [currentCoordinates, setCurrentCoordinates] = useState<CurrentCoordinates | null>(null);
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

  useEffect(() => {
    void refreshCurrentLocation();
  }, []);

  async function refreshCurrentLocation() {
    setIsLoadingCurrentLocation(true);

    try {
      let permission = await getLocationPermissionState();

      if (!permission.granted) {
        permission = await requestLocationPermission();
      }

      if (!permission.granted) {
        return null;
      }

      const lastKnownPosition = await Location.getLastKnownPositionAsync();

      if (lastKnownPosition) {
        setCurrentCoordinates({
          latitude: lastKnownPosition.coords.latitude,
          longitude: lastKnownPosition.coords.longitude,
        });
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(() => null);

      const resolvedPosition = currentPosition ?? lastKnownPosition;

      if (!resolvedPosition) {
        return null;
      }

      const nextCoordinates = {
        latitude: resolvedPosition.coords.latitude,
        longitude: resolvedPosition.coords.longitude,
      };

      setCurrentCoordinates(nextCoordinates);
      return nextCoordinates;
    } catch (error) {
      console.warn('Unable to resolve current location', error);
      return null;
    } finally {
      setIsLoadingCurrentLocation(false);
    }
  }

  return {
    currentCoordinates,
    isLoadingCurrentLocation,
    refreshCurrentLocation,
  };
}
