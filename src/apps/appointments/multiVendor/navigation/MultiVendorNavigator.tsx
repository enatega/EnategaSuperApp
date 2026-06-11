import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { MultiVendorStackParamList } from './types';
import MultiVendorDetailsScreen from '../screens/DetailsScreen';
import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();

export default function MultiVendorNavigator() {
  const { t } = useTranslation('appointments');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MultiVendorTabs"
        component={MultiVendorBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiVendorDetails"
        component={MultiVendorDetailsScreen}
        options={{ title: t('screen_details') }}
      />
    </Stack.Navigator>
  );
}
