import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeliveriesHomeScreen from '../screens/HomeScreen';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import { useTranslation } from 'react-i18next';
import type { DeliveriesStackParamList } from './types';

const Stack = createNativeStackNavigator<DeliveriesStackParamList>();

export default function DeliveriesNavigator() {
  const { t } = useTranslation('deliveries');
  return (
    <Stack.Navigator>
      <Stack.Screen name="DeliveriesHome" options={{ title: t('header_title') }}>
        {(props) => (
          <DeliveriesHomeScreen
            {...props}
            onSelect={(type) => {
              if (type === 'singleVendor') props.navigation.navigate('SingleVendor');
              if (type === 'multiVendor') props.navigation.navigate('MultiVendor');
              if (type === 'chain') props.navigation.navigate('Chain');
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SingleVendor" component={SingleVendorNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MultiVendor" component={MultiVendorNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Chain" component={ChainNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
