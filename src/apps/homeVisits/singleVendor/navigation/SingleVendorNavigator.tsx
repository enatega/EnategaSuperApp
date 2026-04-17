import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import VisitDetails from '../../screens/VisitDetails';
import ServiceDetailsPage from '../screens/ServiceDetailsPage';
import SingleVendorBottomTabNavigator from './SingleVendorBottomTabNavigator';
import AddressSearchScreen from '../../../../general/screens/address/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../../../general/screens/address/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../../../general/screens/address/AddressDetailScreen';
import type { HomeVisitsSingleVendorNavigationParamList } from './types';

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
        options={{ title: t('details_title') }}
      />
      <Stack.Screen
        name="ServiceDetailsPage"
        component={ServiceDetailsPage}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={sharedScreenOptions}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={sharedScreenOptions}
      />
    </Stack.Navigator>
  );
}
