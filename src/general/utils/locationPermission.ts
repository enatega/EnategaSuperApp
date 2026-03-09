import { Linking } from 'react-native';
import * as Location from 'expo-location';

export type LocationPermissionState = {
  granted: boolean;
  canAskAgain: boolean;
  blocked: boolean;
  undetermined: boolean;
  status: Location.LocationPermissionResponse['status'];
};

const mapPermissionResponse = (
  response: Location.LocationPermissionResponse
): LocationPermissionState => ({
  granted: response.granted,
  canAskAgain: response.canAskAgain,
  blocked: !response.granted && !response.canAskAgain,
  undetermined: response.status === Location.PermissionStatus.UNDETERMINED,
  status: response.status,
});

export async function getLocationPermissionState(): Promise<LocationPermissionState> {
  const response = await Location.getForegroundPermissionsAsync();
  return mapPermissionResponse(response);
}

export async function requestLocationPermission(): Promise<LocationPermissionState> {
  const response = await Location.requestForegroundPermissionsAsync();
  return mapPermissionResponse(response);
}

export async function openAppLocationSettings(): Promise<void> {
  await Linking.openSettings();
}
