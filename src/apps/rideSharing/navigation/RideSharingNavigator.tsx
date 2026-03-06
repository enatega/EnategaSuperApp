import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideSharingHomeScreen from '../screens/home/HomeScreen';
import RideOptionsScreen from '../screens/rideOptions/RideOptionsScreen';
import RideDetails from '../screens/rideDetails/RideDetails';
import DriverProfileScreen from '../screens/driverProfile/DriverProfileScreen';
import RideAddressSearchScreen from '../screens/rideSearch/RideAddressSearchScreen';
import { useTranslation } from 'react-i18next';
import QueryProvider from '../../../general/providers/QueryProvider';

const Stack = createNativeStackNavigator();

export default function RideSharingNavigator() {
  const { t } = useTranslation('rideSharing');
  return (
    <QueryProvider>
      <Stack.Navigator>
        <Stack.Screen name="RideSharingHome" component={RideSharingHomeScreen} options={{ headerShown:false, title: t('header_title') }} />
        <Stack.Screen name="RideOptions" component={RideOptionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideAddressSearch" component={RideAddressSearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RideDetails" component={RideDetails} options={{ title: t('details_title') }} />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryProvider>
  );
}
