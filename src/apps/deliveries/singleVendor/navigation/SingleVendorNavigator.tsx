import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleVendorDeliveryDetails from '../screens/DeliveryDetails';
import { useTranslation } from 'react-i18next';
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
    </Stack.Navigator>
  );
}
