import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentsHomeScreen from '../screens/HomeScreen';
import AppointmentDetails from '../screens/AppointmentDetails';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import AddressSearchScreen from '../../../general/screens/address/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../../general/screens/address/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../../general/screens/address/AddressDetailScreen';
import { useTranslation } from 'react-i18next';
import type { AppointmentsStackParamList } from './types';

const Stack = createNativeStackNavigator<AppointmentsStackParamList>();

const hiddenHeaderOptions = { headerShown: false } as const;

export default function AppointmentsNavigator() {
  const { t } = useTranslation('appointments');
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentsHome"
        component={AppointmentsHomeScreen}
        options={{ title: t('header_title') }}
      />
      <Stack.Screen
        name="AppointmentDetails"
        component={AppointmentDetails}
        options={{ title: t('details_title') }}
      />
      <Stack.Screen
        name="SingleVendor"
        component={SingleVendorNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="MultiVendor"
        component={MultiVendorNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="Chain"
        component={ChainNavigator}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={hiddenHeaderOptions}
      />
    </Stack.Navigator>
  );
}
