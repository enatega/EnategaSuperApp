import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsScreen from '../../../../general/screens/notifications/NotificationsScreen';
import AddressChooseOnMapScreen from '../../../../general/screens/address/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../../../general/screens/address/AddressDetailScreen';
import AddressSearchScreen from '../../../../general/screens/address/AddressSearchScreen';
import HomeVisitsSeeAllScreen from '../../screens/SeeAllScreen/HomeVisitsSeeAllScreen';
import ReviewAndConfirm from '../../screens/ReviewAndConfirm/ReviewAndConfirm';
import ServiceDetails from '../../screens/ServiceDetails/ServiceDetails';
import ServiceDetailsBooking from '../../screens/ServiceDetails/ServiceDetailsBooking';
import ChooseDateAndTime from '../../screens/TeamAndSchedule/ChooseDateAndTime';
import TeamAndSchedule from '../../screens/TeamAndSchedule/TeamAndSchedule';
import VisitDetails from '../../screens/VisitDetails';
import BookingDetailsScreen from '../../singleVendor/screens/BookingDetailsScreen';
import CancelAppointmentScreen from '../../singleVendor/screens/CancelAppointmentScreen';
import ContractDetailsScreen from '../../singleVendor/screens/ContractDetailsScreen';
import FavoriteServicesScreen from '../../singleVendor/screens/FavoriteServicesScreen';
import ManageAppointmentScreen from '../../singleVendor/screens/ManageAppointmentScreen';
import TrackWorkerScreen from '../../singleVendor/screens/TrackWorkerScreen';
import CenterDetailsScreen from '../../multiVendor/screens/CenterDetailsScreen';
import ChainBottomTabNavigator from './ChainBottomTabNavigator';
import ChainHomeScreen from '../screens/HomeScreen';
import type { ChainStackParamList } from './types';

const Stack = createNativeStackNavigator<ChainStackParamList>();
const hiddenHeaderOptions = { headerShown: false } as const;

export default function ChainNavigator() {
  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      <Stack.Screen
        name="ChainTabs"
        component={ChainBottomTabNavigator}
      />
      <Stack.Screen
        name="ChainHome"
        component={ChainHomeScreen}
      />
      <Stack.Screen
        name="ChainDetails"
        component={VisitDetails}
      />
      <Stack.Screen
        name="ChainSeeAll"
        component={HomeVisitsSeeAllScreen}
      />
      <Stack.Screen
        name="MultiVendorCenterDetails"
        component={CenterDetailsScreen}
      />
      <Stack.Screen
        name="MultiVendorBookingDetails"
        component={BookingDetailsScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="MultiVendorContractDetails"
        component={ContractDetailsScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="MultiVendorTrackWorker"
        component={TrackWorkerScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="MultiVendorManageAppointment"
        component={ManageAppointmentScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="MultiVendorCancelAppointment"
        component={CancelAppointmentScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="SingleVendorBookingDetails"
        component={BookingDetailsScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="SingleVendorContractDetails"
        component={ContractDetailsScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="SingleVendorTrackWorker"
        component={TrackWorkerScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="SingleVendorManageAppointment"
        component={ManageAppointmentScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="SingleVendorCancelAppointment"
        component={CancelAppointmentScreen as React.ComponentType<any>}
      />
      <Stack.Screen
        name="ServiceDetails"
        component={ServiceDetails}
      />
      <Stack.Screen
        name="ServiceDetailsBooking"
        component={ServiceDetailsBooking}
      />
      <Stack.Screen
        name="TeamAndSchedule"
        component={TeamAndSchedule}
      />
      <Stack.Screen
        name="ChooseDateAndTime"
        component={ChooseDateAndTime}
      />
      <Stack.Screen
        name="ReviewAndConfirm"
        component={ReviewAndConfirm}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
      />
      <Stack.Screen
        name="MultiVendorFavorites"
        component={FavoriteServicesScreen}
      />
      <Stack.Screen
        name="MultiVendorNotifications"
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="SingleVendorFavorites"
        component={FavoriteServicesScreen}
      />
      <Stack.Screen
        name="SingleVendorNotifications"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
}
