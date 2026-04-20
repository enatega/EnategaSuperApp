import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import VisitDetails from '../../screens/VisitDetails';
import BookingDetailsScreen from '../screens/BookingDetailsScreen';
import ManageAppointmentScreen from '../screens/ManageAppointmentScreen';
import CancelAppointmentScreen from '../screens/CancelAppointmentScreen';
import ServiceDetails from '../../screens/ServiceDetails/ServiceDetails';
import ServiceDetailsBooking from '../../screens/ServiceDetails/ServiceDetailsBooking';
import SingleVendorBottomTabNavigator from './SingleVendorBottomTabNavigator';
import type { HomeVisitsSingleVendorNavigationParamList } from './types';
import HomeVisitsSingleVendorSeeAllScreen from '../screens/SeeAllScreen/HomeVisitsSingleVendorSeeAllScreen';
import SingleVendorCategoriesSeeAll from '../../screens/SingleVendorCategoriesSeeAll/SingleVendorCategoriesSeeAll';

const Stack = createNativeStackNavigator<HomeVisitsSingleVendorNavigationParamList>();

const sharedScreenOptions = { headerShown: false } as const;

export default function SingleVendorNavigator() {
  const { t } = useTranslation('homeVisits');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SingleVendorTabs"
        component={SingleVendorBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleVendorDetails"
        component={VisitDetails}
        options={{ headerShown: true, title: t('details_title') }}
      />
      <Stack.Screen
        name="SingleVendorCategoriesSeeAll"
        component={SingleVendorCategoriesSeeAll}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SeeAllScreen"
        component={HomeVisitsSingleVendorSeeAllScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SingleVendorBookingDetails"
        component={BookingDetailsScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SingleVendorManageAppointment"
        component={ManageAppointmentScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="SingleVendorCancelAppointment"
        component={CancelAppointmentScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="ServiceDetailsBooking"
        component={ServiceDetailsBooking}
        options={sharedScreenOptions}
      />
    </Stack.Navigator>
  );
}
