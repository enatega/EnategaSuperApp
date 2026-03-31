import * as SecureStore from 'expo-secure-store';
import type { SharedAppRouteName } from './navigationTypes';

const PENDING_APP_ROUTE_KEY = 'super_app_pending_app_route';
const ACTIVE_APP_ROUTE_KEY = 'super_app_active_app_route';

export async function setPendingAppRoute(routeName: SharedAppRouteName) {
  await SecureStore.setItemAsync(PENDING_APP_ROUTE_KEY, routeName);
}

export function getPendingAppRoute() {
  return SecureStore.getItemAsync(PENDING_APP_ROUTE_KEY) as Promise<SharedAppRouteName | null>;
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
