import * as SecureStore from 'expo-secure-store';
import type { SharedAppRouteName } from './navigationTypes';

const PENDING_APP_ROUTE_KEY = 'super_app_pending_app_route';
const PENDING_DEEP_LINK_URL_KEY = 'super_app_pending_deep_link_url';

export async function setPendingAppRoute(routeName: SharedAppRouteName) {
  await SecureStore.setItemAsync(PENDING_APP_ROUTE_KEY, routeName);
}

export function getPendingAppRoute() {
  return SecureStore.getItemAsync(PENDING_APP_ROUTE_KEY) as Promise<SharedAppRouteName | null>;
}

export async function clearPendingAppRoute() {
  await SecureStore.deleteItemAsync(PENDING_APP_ROUTE_KEY);
}

export async function setPendingDeepLinkUrl(url: string) {
  await SecureStore.setItemAsync(PENDING_DEEP_LINK_URL_KEY, url);
}

export function getPendingDeepLinkUrl() {
  return SecureStore.getItemAsync(PENDING_DEEP_LINK_URL_KEY);
}

export async function clearPendingDeepLinkUrl() {
  await SecureStore.deleteItemAsync(PENDING_DEEP_LINK_URL_KEY);
}
