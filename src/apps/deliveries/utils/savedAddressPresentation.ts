import { Ionicons } from '@expo/vector-icons';
import type { ProfileAddress } from '../multiVendor/api/profileService';

const ADDRESS_ICON_MAP: Record<
  ProfileAddress['type'],
  keyof typeof Ionicons.glyphMap
> = {
  HOME: 'home-outline',
  APARTMENT: 'business-outline',
  OFFICE: 'briefcase-outline',
  OTHER: 'location-outline',
};

export function getSavedAddressIcon(
  type: ProfileAddress['type'] | string,
): keyof typeof Ionicons.glyphMap {
  return ADDRESS_ICON_MAP[type as ProfileAddress['type']] ?? 'location-outline';
}

export function getSavedAddressTypeLabel(
  type: ProfileAddress['type'] | string,
  t: (key: string) => string,
): string {
  const labelMap: Record<ProfileAddress['type'], string> = {
    HOME: t('my_profile_address_home'),
    APARTMENT: t('my_profile_address_apartment'),
    OFFICE: t('my_profile_address_work'),
    OTHER: t('my_profile_address_other'),
  };

  return labelMap[type as ProfileAddress['type']] ?? type;
}
