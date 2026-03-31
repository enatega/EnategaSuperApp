import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList, SharedAppRouteName } from './navigationTypes';
import { clearPendingAppRoute, getPendingAppRoute, setActiveAppRoute } from './pendingAppRedirect';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export async function redirectToPendingAppIfNeeded() {
  const routeName = await getPendingAppRoute();

  if (!routeName || !navigationRef.isReady()) {
    return false;
  }

  navigationRef.resetRoot({
    index: 0,
    routes: [
      {
        name: 'Main',
        params: {
          screen: routeName,
        },
      },
    ],
  });

  await setActiveAppRoute(routeName);
  await clearPendingAppRoute();
  return true;
}

export function resetToSharedRoute(routeName: SharedAppRouteName) {
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
