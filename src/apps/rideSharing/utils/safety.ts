import { Linking } from 'react-native';

export const DEFAULT_RIDE_SHARING_EMERGENCY_NUMBER = '15';

export function resolveEmergencyNumber(emergencyNumber?: string) {
  const normalizedNumber = emergencyNumber?.trim();

  if (normalizedNumber) {
    return normalizedNumber;
  }

  return DEFAULT_RIDE_SHARING_EMERGENCY_NUMBER;
}

export function openEmergencyDialer(emergencyNumber?: string) {
  const resolvedNumber = resolveEmergencyNumber(emergencyNumber);
  return Linking.openURL(`tel:${resolvedNumber}`);
}
