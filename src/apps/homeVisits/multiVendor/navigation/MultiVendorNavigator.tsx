import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import VisitDetails from '../../screens/VisitDetails';
import MultiVendorHomeScreen from '../screens/HomeScreen';
import type { MultiVendorStackParamList } from './types';

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();

export default function MultiVendorNavigator() {
  const { t } = useTranslation('homeVisits');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MultiVendorHome"
        component={MultiVendorHomeScreen}
        options={{ title: t('multi_vendor_title') }}
      />
      <Stack.Screen
        name="MultiVendorDetails"
        component={VisitDetails}
        options={{ title: t('details_title') }}
      />
    </Stack.Navigator>
  );
}
