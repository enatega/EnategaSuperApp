import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChainHomeScreen from '../screens/HomeScreen';
import ChainDeliveryDetails from '../screens/DeliveryDetails';
import { useTranslation } from 'react-i18next';

const Stack = createNativeStackNavigator();

export default function ChainNavigator() {
  const { t } = useTranslation('deliveries');
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChainHome" component={ChainHomeScreen} options={{ title: t('chain_title') }} />
      <Stack.Screen name="ChainDetails" component={ChainDeliveryDetails} options={{ title: t('details_title') }} />
    </Stack.Navigator>
  );
}
