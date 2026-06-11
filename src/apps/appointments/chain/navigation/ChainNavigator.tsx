import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import type { ChainStackParamList } from './types';
import ChainBottomTabNavigator from './ChainBottomTabNavigator';
import ChainDetailsScreen from '../screens/DetailsScreen';

const Stack = createNativeStackNavigator<ChainStackParamList>();

export default function ChainNavigator() {
  const { t } = useTranslation('appointments');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChainTabs"
        component={ChainBottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChainDetails"
        component={ChainDetailsScreen}
        options={{ title: t('screen_details') }}
      />
    </Stack.Navigator>
  );
}
