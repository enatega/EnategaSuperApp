import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationsScreen from '../../../../general/screens/notifications/NotificationsScreen';
import CentersSeeAllScreen from '../screens/CentersSeeAllScreen';
import CenterDetailsScreen from '../screens/CenterDetailsScreen';
import ServiceTypeDetailsScreen from '../screens/ServiceTypeDetailsScreen';
import HomeVisitsSeeAllScreen from '../../screens/SeeAllScreen/HomeVisitsSeeAllScreen';
import FavoriteServicesScreen from '../../singleVendor/screens/FavoriteServicesScreen';
import BookingDetailsScreen from '../../singleVendor/screens/BookingDetailsScreen';
import CancelAppointmentScreen from '../../singleVendor/screens/CancelAppointmentScreen';
import ContractDetailsScreen from '../../singleVendor/screens/ContractDetailsScreen';
import ManageAppointmentScreen from '../../singleVendor/screens/ManageAppointmentScreen';
import TrackWorkerScreen from '../../singleVendor/screens/TrackWorkerScreen';
import ServiceDetails from '../../screens/ServiceDetails/ServiceDetails';
import ServiceDetailsBooking from '../../screens/ServiceDetails/ServiceDetailsBooking';
import TeamAndSchedule from '../../screens/TeamAndSchedule/TeamAndSchedule';
import ChooseDateAndTime from '../../screens/TeamAndSchedule/ChooseDateAndTime';
import ReviewAndConfirm from '../../screens/ReviewAndConfirm/ReviewAndConfirm';
import AddressSearchScreen from '../../../../general/screens/address/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../../../general/screens/address/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../../../general/screens/address/AddressDetailScreen';
import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';
import type { MultiVendorStackParamList } from './types';

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();
const hiddenHeaderOptions = { headerShown: false } as const;

export default function MultiVendorNavigator() {
  return (
    <Stack.Navigator screenOptions={hiddenHeaderOptions}>
      <Stack.Screen
        name="MultiVendorTabs"
        component={MultiVendorBottomTabNavigator}
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
        name="MultiVendorSeeAll"
        component={HomeVisitsSeeAllScreen}
      />
      <Stack.Screen
        name="MultiVendorCentersSeeAll"
        component={CentersSeeAllScreen}
      />
      <Stack.Screen
        name="MultiVendorServiceTypeDetails"
        component={ServiceTypeDetailsScreen}
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
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen
        name="ServiceDetailsBooking"
        component={ServiceDetailsBooking}
      />
      <Stack.Screen name="TeamAndSchedule" component={TeamAndSchedule} />
      <Stack.Screen name="ChooseDateAndTime" component={ChooseDateAndTime} />
      <Stack.Screen name="ReviewAndConfirm" component={ReviewAndConfirm} />
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
    </Stack.Navigator>
  );
}
