import { createNavigationContainerRef } from '@react-navigation/native';
import type {
  AuthStackParamList,
  RootStackParamList,
  SharedAppRouteName,
  SharedStackParamList,
} from './navigationTypes';
import { clearPendingAppRoute, getPendingAppRoute, setActiveAppRoute } from './pendingAppRedirect';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export async function redirectToPendingAppIfNeeded() {
  const routeName = (await getPendingAppRoute()) ?? 'Deliveries';

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

  await setActiveAppRoute(routeName);
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

export function resetToAuth(screen: keyof AuthStackParamList = 'login') {
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
          params: {
            screen,
          },
        },
      },
    ],
  });

  return true;
}
