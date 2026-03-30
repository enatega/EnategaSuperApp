import { createNavigationContainerRef } from '@react-navigation/native';
import { authSession } from '../auth/authSession';
import type { RootStackParamList, SharedAppRouteName } from './navigationTypes';
import { parseStoreDetailsDeepLink } from './deepLinks';
import {
  clearPendingAppRoute,
  clearPendingDeepLinkUrl,
  getPendingAppRoute,
  getPendingDeepLinkUrl,
  setPendingAppRoute,
  setPendingDeepLinkUrl,
} from './pendingAppRedirect';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

type MainRouteParams = NonNullable<RootStackParamList['Main']>;

function resetRootToMain(params: MainRouteParams) {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: 'Main',
        params,
      },
    ],
  });

  return true;
}

function buildStoreDetailsRootParams(storeId: string): MainRouteParams {
  return {
    screen: 'Deliveries',
    params: {
      screen: 'MultiVendor',
      params: {
        screen: 'StoreDetails',
        params: {
          storeId,
        },
      },
    },
  };
}

export function resetToStoreDetails(storeId: string) {
  return resetRootToMain(buildStoreDetailsRootParams(storeId));
}

export async function redirectToPendingAppIfNeeded() {
  if (!navigationRef.isReady()) {
    return false;
  }

  const pendingDeepLinkUrl = await getPendingDeepLinkUrl();

  if (pendingDeepLinkUrl) {
    const storeDetailsDeepLink = parseStoreDetailsDeepLink(pendingDeepLinkUrl);

    await clearPendingDeepLinkUrl();

    if (storeDetailsDeepLink) {
      await clearPendingAppRoute();
      return resetToStoreDetails(storeDetailsDeepLink.storeId);
    }
  }

  const routeName = await getPendingAppRoute();

  if (!routeName) {
    return false;
  }

  const wasReset = resetToSharedRoute(routeName);

  if (wasReset) {
    await clearPendingAppRoute();
  }

  return wasReset;
}

export function resetToSharedRoute(routeName: SharedAppRouteName) {
  return resetRootToMain({
    screen: routeName,
  });
}

export async function handleIncomingDeepLinkUrl(url: string) {
  const storeDetailsDeepLink = parseStoreDetailsDeepLink(url);

  if (!storeDetailsDeepLink) {
    return false;
  }

  const token = await authSession.getAccessToken();

  if (token) {
    return resetToStoreDetails(storeDetailsDeepLink.storeId);
  }

  await Promise.all([
    setPendingDeepLinkUrl(url),
    setPendingAppRoute('Deliveries'),
  ]);

  return resetRootToMain({
    screen: 'Auth',
  });
}
