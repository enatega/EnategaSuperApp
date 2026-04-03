import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import AddressChooseOnMapScreen from '../../screens/addresses/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../screens/addresses/AddressDetailScreen';
import AddressSearchScreen from '../../screens/addresses/AddressSearchScreen';
import SingleVendorDeliveryDetails from '../screens/DeliveryDetails';
import SinglevendorBottomTabNavigator from './SinglevendorBottomTabNavigator';
import type { SingleVendorStackParamList } from './types';

const Stack = createNativeStackNavigator<SingleVendorStackParamList>();

export default function SingleVendorNavigator() {
  const { t } = useTranslation('deliveries');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SingleVendorTabs"
        component={SinglevendorBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SingleVendorDetails"
        component={SingleVendorDeliveryDetails}
        options={{ title: t('details_title') }}
      />
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
