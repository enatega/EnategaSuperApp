import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import VisitDetails from '../../screens/VisitDetails';
import ChainHomeScreen from '../screens/HomeScreen';
import type { ChainStackParamList } from './types';

const Stack = createNativeStackNavigator<ChainStackParamList>();

export default function ChainNavigator() {
  const { t } = useTranslation('homeVisits');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChainHome"
        component={ChainHomeScreen}
        options={{ title: t('chain_title') }}
      />
      <Stack.Screen
        name="ChainDetails"
        component={VisitDetails}
        options={{ title: t('details_title') }}
      />
    </Stack.Navigator>
  );
}
