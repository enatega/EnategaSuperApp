import * as SecureStore from 'expo-secure-store';
import type { HomeVisitsMode, HomeVisitsStackParamList } from './types';

export type HomeVisitModeRootRoute = keyof HomeVisitsStackParamList;

const HOME_VISIT_MODE_KEY = 'super_app_home_visits_mode';
export const DEFAULT_HOME_VISIT_MODE: HomeVisitsMode = 'singleVendor';

export async function setHomeVisitModePreference(mode: HomeVisitsMode) {
  await SecureStore.setItemAsync(HOME_VISIT_MODE_KEY, mode);
}

export async function getHomeVisitModePreference() {
  return (await SecureStore.getItemAsync(HOME_VISIT_MODE_KEY)) as HomeVisitsMode | null;
}

export function mapHomeVisitModeToRoute(mode: HomeVisitsMode): HomeVisitModeRootRoute {
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
