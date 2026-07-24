import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { ChainStackParamList } from './types';
import ChainBottomTabNavigator from './ChainBottomTabNavigator';
import ChainDetailsScreen from '../screens/DetailsScreen';
import AppointmentBookingSuccessScreen from '../../screens/AppointmentBookingSuccessScreen';
import AppointmentBookingDetailScreen from '../../screens/AppointmentBookingDetailScreen';
import AppointmentCartScreen from '../../screens/AppointmentCartScreen';
import AppointmentReviewConfirmScreen from '../../screens/AppointmentReviewConfirmScreen';
import AppointmentServicesScreen from '../../screens/AppointmentServicesScreen';
import AppointmentTeamScreen from '../../screens/AppointmentTeamScreen';

const Stack = createNativeStackNavigator<ChainStackParamList>();

export default function ChainNavigator() {
  const { t } = useTranslation('appointments');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChainTabs"
        component={ChainBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChainDetails"
        component={ChainDetailsScreen}
        options={{ headerShown: false, title: t('screen_details') }}
      />
      <Stack.Screen
        name="Services"
        component={AppointmentServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentCart"
        component={AppointmentCartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Team"
        component={AppointmentTeamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewConfirm"
        component={AppointmentReviewConfirmScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookingSuccess"
        component={AppointmentBookingSuccessScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentBookingDetail"
        component={AppointmentBookingDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
