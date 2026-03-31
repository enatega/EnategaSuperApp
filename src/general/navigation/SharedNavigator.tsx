import React, { useCallback } from 'react';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import DeliveriesNavigator from '../../apps/deliveries/navigation/DeliveriesNavigator';
import RideSharingNavigator from '../../apps/rideSharing/navigation/RideSharingNavigator';
import HomeVisitsNavigator from '../../apps/homeVisits/navigation/HomeVisitsNavigator';
import AppointmentsNavigator from '../../apps/appointments/navigation/AppointmentsNavigator';
import DeveloperModeNavigator from '../../apps/developerMode/navigation/DeveloperModeNavigator';
import AuthNavigator from './AuthNavigator';
import { authSession } from '../auth/authSession';
import type { MiniAppId } from '../utils/constants';
import type { SharedAppRouteName, SharedStackParamList } from './navigationTypes';
import { setPendingAppRoute } from './pendingAppRedirect';

const Stack = createNativeStackNavigator<SharedStackParamList>();
const APP_ROUTES: Partial<Record<MiniAppId, SharedAppRouteName>> = {
  deliveries: 'Deliveries',
  rideSharing: 'RideSharing',
  homeVisits: 'HomeVisits',
  appointments: 'Appointments',
  developerMode: 'DeveloperMode',
};

export default function SharedNavigator() {
  const handleSelectMiniApp = useCallback(
    async (
      id: MiniAppId,
      navigation: NativeStackNavigationProp<SharedStackParamList, 'Home'>,
    ) => {
      const routeName = APP_ROUTES[id];

      if (!routeName) {
        return;
      }

      const token = await authSession.getAccessToken();

      if (token) {
        navigation.navigate(routeName);
        return;
      }

      await setPendingAppRoute(routeName);
      navigation.navigate('Auth');
    },
    [],
  );

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => (
          <HomeScreen
            {...props}
            onSelectMiniApp={(id) => {
              void handleSelectMiniApp(id, props.navigation);
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Deliveries" component={DeliveriesNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="RideSharing" component={RideSharingNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="HomeVisits" component={HomeVisitsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Appointments" component={AppointmentsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="DeveloperMode" component={DeveloperModeNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
