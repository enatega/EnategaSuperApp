import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { SingleVendorStackParamList } from './types';
import SingleVendorDetailsScreen from '../screens/DetailsScreen';
import SingleVendorBottomTabNavigator from './SingleVendorBottomTabNavigator';
import AppointmentBookingSuccessScreen from '../../screens/AppointmentBookingSuccessScreen';
import AppointmentBookingDetailScreen from '../../screens/AppointmentBookingDetailScreen';
import AppointmentCartScreen from '../../screens/AppointmentCartScreen';
import AppointmentReviewConfirmScreen from '../../screens/AppointmentReviewConfirmScreen';
import AppointmentServicesScreen from '../../screens/AppointmentServicesScreen';
import AppointmentTeamScreen from '../../screens/AppointmentTeamScreen';
import SingleVendorFavouriteServicesScreen from '../screens/FavouriteServicesScreen';

const Stack = createNativeStackNavigator<SingleVendorStackParamList>();

export default function SingleVendorNavigator() {
  const { t } = useTranslation('appointments');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SingleVendorTabs"
        component={SingleVendorBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleVendorFavouriteServices"
        component={SingleVendorFavouriteServicesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleVendorDetails"
        component={SingleVendorDetailsScreen}
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
