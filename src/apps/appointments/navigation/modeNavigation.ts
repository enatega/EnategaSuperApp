import {
  CommonActions,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import { useAppointmentsConfigStore } from '../stores/useAppointmentsConfigStore';

type AppointmentsModeTab = 'bookings' | 'home' | 'search';

const MODE_ROUTES = ['SingleVendor', 'MultiVendor', 'Chain'];

function findAppointmentsNavigation(
  navigation: NavigationProp<ParamListBase>,
): NavigationProp<ParamListBase> {
  let current = navigation;

  while (current.getParent()) {
    if (MODE_ROUTES.every((route) => current.getState().routeNames.includes(route))) {
      return current;
    }
    current = current.getParent() as NavigationProp<ParamListBase>;
  }

  return current;
}

export function navigateToActiveAppointmentsTab(
  navigation: NavigationProp<ParamListBase>,
  tab: AppointmentsModeTab,
) {
  const mode = useAppointmentsConfigStore.getState().mode;
  const appointmentsNavigation = findAppointmentsNavigation(navigation);

  const destination =
    mode === 'singleVendor'
      ? {
          name: 'SingleVendor',
          params: {
            screen: 'SingleVendorTabs',
            params: {
              screen:
                tab === 'bookings'
                  ? 'SingleVendorTabBookings'
                  : tab === 'search'
                    ? 'SingleVendorTabSearch'
                    : 'SingleVendorTabHome',
            },
          },
        }
      : mode === 'chain'
        ? {
            name: 'Chain',
            params: {
              screen: 'ChainTabs',
              params: {
                screen:
                  tab === 'bookings'
                    ? 'ChainTabBookings'
                    : tab === 'search'
                      ? 'ChainTabSearch'
                      : 'ChainTabHome',
              },
            },
          }
        : {
            name: 'MultiVendor',
            params: {
              screen: 'MultiVendorTabs',
              params: {
                screen:
                  tab === 'bookings'
                    ? 'MultiVendorTabBookings'
                    : tab === 'search'
                      ? 'MultiVendorTabSearch'
                      : 'MultiVendorTabHome',
              },
            },
          };

  appointmentsNavigation.dispatch(CommonActions.navigate(destination));
}
