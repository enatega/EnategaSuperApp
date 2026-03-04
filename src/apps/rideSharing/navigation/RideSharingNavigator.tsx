import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideSharingHomeScreen from '../screens/home/HomeScreen';
import RideDetails from '../screens/rideDetails/RideDetails';
import DriverProfileScreen from '../screens/driverProfile/DriverProfileScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import EditNameScreen from '../screens/profile/EditNameScreen';
import EditPhoneScreen from '../screens/profile/EditPhoneScreen';
import { useTranslation } from 'react-i18next';
import QueryProvider from '../providers/QueryProvider';

const Stack = createNativeStackNavigator();

export default function RideSharingNavigator() {
  const { t } = useTranslation('rideSharing');
  return (
    <QueryProvider>
      <Stack.Navigator>
        <Stack.Screen name="RideSharingHome" component={RideSharingHomeScreen} options={{ headerShown:false, title: t('header_title') }} />
        <Stack.Screen name="RideDetails" component={RideDetails} options={{ title: t('details_title') }} />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ headerShown: false }}
        />
        {/* Profile Screens */}
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfoScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditName"
          component={EditNameScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditPhone"
          component={EditPhoneScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryProvider>
  );
}
