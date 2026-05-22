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

function toCoordinates(position: Location.LocationObject | Location.LocationLastKnownObject): CurrentCoordinates {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

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
        const lastKnownCoordinates = toCoordinates(lastKnownPosition);
        setCurrentCoordinates(lastKnownCoordinates);

        // Keep GPS refinement non-blocking so navigation can happen instantly.
        void Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
          .then((currentPosition) => {
            setCurrentCoordinates(toCoordinates(currentPosition));
          })
          .catch(() => {
            // Last known location is already applied.
          })
          .finally(() => {
            setIsLoadingCurrentLocation(false);
          });

        return lastKnownCoordinates;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }).catch(() => null);

      if (!currentPosition) {
        return null;
      }

      const nextCoordinates = toCoordinates(currentPosition);
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
