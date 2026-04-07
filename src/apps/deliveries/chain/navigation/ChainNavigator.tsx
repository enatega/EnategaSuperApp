import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChainDeliveryDetails from '../screens/DeliveryDetails';
import ChainBottomTabNavigator from './ChainBottomTabNavigator';
import { useTranslation } from 'react-i18next';
import type { ChainStackParamList } from './types';

const Stack = createNativeStackNavigator<ChainStackParamList>();

export default function ChainNavigator() {
  const { t } = useTranslation('deliveries');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChainTabs"
        component={ChainBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChainDetails"
        component={ChainDeliveryDetails}
        options={{ title: t('details_title') }}
      />
    </Stack.Navigator>
  );
}
