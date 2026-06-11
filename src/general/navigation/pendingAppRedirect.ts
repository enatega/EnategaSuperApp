import * as SecureStore from 'expo-secure-store';
import type { SharedStackParamList } from './navigationTypes';
import type { SharedAppRouteName } from '../../apps/registry/generated/appRegistry';

const PENDING_APP_ROUTE_KEY = 'super_app_pending_app_route';
const ACTIVE_APP_ROUTE_KEY = 'super_app_active_app_route';

export type PendingAppRoute = {
  routeName: SharedAppRouteName;
  params?: SharedStackParamList[SharedAppRouteName];
};

export async function setPendingAppRoute(
  routeName: SharedAppRouteName,
  params?: SharedStackParamList[SharedAppRouteName],
) {
  const payload: PendingAppRoute = { routeName, params };
  await SecureStore.setItemAsync(PENDING_APP_ROUTE_KEY, JSON.stringify(payload));
}

export function getPendingAppRoute() {
  return SecureStore.getItemAsync(PENDING_APP_ROUTE_KEY).then((value) => {
    if (!value) {
      return null;
    }

    try {
      const parsed = JSON.parse(value) as PendingAppRoute;
      if (parsed && typeof parsed.routeName === 'string') {
        return parsed;
      }
    } catch {
      return { routeName: value as SharedAppRouteName };
    }

    return null;
  });
}

export async function clearPendingAppRoute() {
  await SecureStore.deleteItemAsync(PENDING_APP_ROUTE_KEY);
}

export async function setActiveAppRoute(routeName: SharedAppRouteName) {
  await SecureStore.setItemAsync(ACTIVE_APP_ROUTE_KEY, routeName);
}

export function getActiveAppRoute() {
  return SecureStore.getItemAsync(ACTIVE_APP_ROUTE_KEY) as Promise<SharedAppRouteName | null>;
}

export async function clearActiveAppRoute() {
  await SecureStore.deleteItemAsync(ACTIVE_APP_ROUTE_KEY);
}
