import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { SingleVendorStackParamList } from './types';
import SingleVendorDetailsScreen from '../screens/DetailsScreen';
import SingleVendorBottomTabNavigator from './SingleVendorBottomTabNavigator';

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
        name="SingleVendorDetails"
        component={SingleVendorDetailsScreen}
        options={{ title: t('screen_details') }}
      />
    </Stack.Navigator>
  );
}
