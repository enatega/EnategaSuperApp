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

      const position =
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch(() => null)) ??
        (await Location.getLastKnownPositionAsync());

      if (!position) {
        return null;
      }

      const nextCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
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
