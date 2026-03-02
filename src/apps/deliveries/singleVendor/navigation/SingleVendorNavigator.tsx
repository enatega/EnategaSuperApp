import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SingleVendorHomeScreen from '../screens/HomeScreen';
import SingleVendorDeliveryDetails from '../screens/DeliveryDetails';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function SingleVendorNavigator() {
  const { t } = useTranslation('deliveries');
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SingleVendorHome"
        component={SingleVendorHomeScreen}
        options={{ title: t('single_vendor_title') }}
      />
      <Stack.Screen
        name="SingleVendorDetails"
        component={SingleVendorDeliveryDetails}
        options={{ title: t('details_title') }}
      />
    </Stack.Navigator>
  );
}
