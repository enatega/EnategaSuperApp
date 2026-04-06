import * as SecureStore from 'expo-secure-store';

export type DeliveryMode = 'singleVendor' | 'multiVendor' | 'chain';
export type DeliveryModeRootRoute = 'SingleVendor' | 'MultiVendor' | 'Chain';

const DELIVERY_MODE_KEY = 'super_app_deliveries_mode';
export const DEFAULT_DELIVERY_MODE: DeliveryMode = 'multiVendor';

export async function setDeliveryModePreference(mode: DeliveryMode) {
  await SecureStore.setItemAsync(DELIVERY_MODE_KEY, mode);
}

export async function getDeliveryModePreference() {
  return (await SecureStore.getItemAsync(DELIVERY_MODE_KEY)) as DeliveryMode | null;
}

export function mapDeliveryModeToRoute(mode: DeliveryMode): DeliveryModeRootRoute {
  switch (mode) {
    case 'multiVendor':
      return 'MultiVendor';
    case 'chain':
      return 'Chain';
    case 'singleVendor':
    default:
      return 'SingleVendor';
  }
}
