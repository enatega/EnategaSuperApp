import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import VisitDetails from '../../screens/VisitDetails';
import SingleVendorBottomTabNavigator from './SingleVendorBottomTabNavigator';
import type { SingleVendorStackParamList } from './types';

const Stack = createNativeStackNavigator<SingleVendorStackParamList>();

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
    </Stack.Navigator>
  );
}
