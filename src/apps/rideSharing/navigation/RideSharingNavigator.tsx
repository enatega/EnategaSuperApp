import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RideSharingHomeScreen from '../screens/HomeScreen';
import RideDetails from '../screens/RideDetails';
import { useTranslation } from 'react-i18next';
import QueryProvider from '../providers/QueryProvider';

const Stack = createNativeStackNavigator();

export default function RideSharingNavigator() {
  const { t } = useTranslation('rideSharing');
  return (
    <QueryProvider>
      <Stack.Navigator>
        <Stack.Screen name="RideSharingHome" component={RideSharingHomeScreen} options={{ title: t('header_title') }} />
        <Stack.Screen name="RideDetails" component={RideDetails} options={{ title: t('details_title') }} />
      </Stack.Navigator>
    </QueryProvider>
  );
}
