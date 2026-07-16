import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList, SharedStackParamList } from './navigationTypes';
import type { SharedAppRouteName } from '../../apps/registry/generated/appRegistry';
import { clearPendingAppRoute, getPendingAppRoute, setActiveAppRoute } from './pendingAppRedirect';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export async function redirectToPendingAppIfNeeded() {
  const pendingRoute = await getPendingAppRoute();

  if (!pendingRoute || !navigationRef.isReady()) {
    return false;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: 'Main',
        params: {
          screen: pendingRoute.routeName,
          params: pendingRoute.params,
        },
      },
    ],
  });

  await setActiveAppRoute(pendingRoute.routeName);
  await clearPendingAppRoute();
  return true;
}

export function resetToSharedRoute(
  routeName: SharedAppRouteName,
  params?: SharedStackParamList[SharedAppRouteName],
) {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: 'Main',
        params: {
          screen: routeName,
          params,
        },
      },
    ],
  });

  return true;
}

export function resetToSharedHome() {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: 'Main',
        params: {
          screen: 'Home',
        },
      },
    ],
  });

  return true;
}

export function resetToAuth() {
  if (!navigationRef.isReady()) {
    return false;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: 'Main',
        params: {
          screen: 'Auth',
        },
      },
    ],
  });

  return true;
}
