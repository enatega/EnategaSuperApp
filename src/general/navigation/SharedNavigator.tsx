import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import DeliveriesNavigator from '../../apps/deliveries/navigation/DeliveriesNavigator';
import RideSharingNavigator from '../../apps/rideSharing/navigation/RideSharingNavigator';
import HomeVisitsNavigator from '../../apps/homeVisits/navigation/HomeVisitsNavigator';
import AppointmentsNavigator from '../../apps/appointments/navigation/AppointmentsNavigator';
import DeveloperModeNavigator from '../../apps/developerMode/navigation/DeveloperModeNavigator';
import AuthNavigator from './AuthNavigator';

const Stack = createNativeStackNavigator();

export default function SharedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" options={{ headerShown: false }}>
        {(props) => (
          <HomeScreen
            {...props}
            onSelectMiniApp={(id) => {
              if (id === 'deliveries') props.navigation.navigate('Deliveries');
              if (id === 'rideSharing') props.navigation.navigate('RideSharing');
              if (id === 'homeVisits') props.navigation.navigate('HomeVisits');
              if (id === 'appointments') props.navigation.navigate('Appointments');
              if (id === 'developerMode') props.navigation.navigate('DeveloperMode');
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
