import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentsHomeScreen from '../screens/HomeScreen';
import AppointmentDetails from '../screens/AppointmentDetails';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function AppointmentsNavigator() {
  const { t } = useTranslation('appointments');
  return (
    <Stack.Navigator>
      <Stack.Screen name="AppointmentsHome" component={AppointmentsHomeScreen} options={{ title: t('header_title') }} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} options={{ title: t('details_title') }} />
    </Stack.Navigator>
  );
}
