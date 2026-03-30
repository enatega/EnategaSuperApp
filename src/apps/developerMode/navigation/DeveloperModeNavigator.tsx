import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeveloperModeHomeScreen from '../screens/home/HomeScreen';
import DriverProfileScreen from '../../rideSharing/screens/driverProfile/DriverProfileScreen';
import RateOrderScreen from '../../deliveries/screens/RateOrderScreen/RateOrderScreen';
import CourierDetails from '../../rideSharing/screens/courierDetails/CourierDetails';
import QueryProvider from '../../../general/providers/QueryProvider';
import ProductInfo from '../../deliveries/screens/ProductInfo/ProductInfo';

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
          name="CourierDetails"
          component={CourierDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductInfo"
          component={ProductInfo}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryProvider>
  );
}
