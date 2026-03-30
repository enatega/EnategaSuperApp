import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeveloperModeHomeScreen from '../screens/home/HomeScreen';
import DriverProfileScreen from '../../rideSharing/screens/driverProfile/DriverProfileScreen';
import RateOrderScreen from '../../deliveries/screens/RateOrderScreen/RateOrderScreen';
import RiderChatScreen from '../../deliveries/screens/RiderChatScreen/RiderChatScreen';
import QueryProvider from '../../../general/providers/QueryProvider';
import CourierDetails from '../../rideSharing/screens/courierDetails/CourierDetails';

const Stack = createNativeStackNavigator();

export default function DeveloperModeNavigator() {
  return (
    <QueryProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="DeveloperModeHome"
          component={DeveloperModeHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RateOrder"
          component={RateOrderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RiderChat"
          component={RiderChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourierDetails"
          component={CourierDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryProvider>
  );
}
