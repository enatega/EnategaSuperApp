import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeliveriesHomeScreen from '../screens/HomeScreen';
import SingleVendorNavigator from '../singleVendor/navigation/SingleVendorNavigator';
import MultiVendorNavigator from '../multiVendor/navigation/MultiVendorNavigator';
import ChainNavigator from '../chain/navigation/ChainNavigator';
import { useTranslation } from 'react-i18next';
import ProductInfo from '../screens/ProductInfo/ProductInfo';
import {
  DEFAULT_DELIVERY_MODE,
  getDeliveryModePreference,
  setDeliveryModePreference,
  type DeliveryMode,
} from './deliveryModePreference';

const Stack = createNativeStackNavigator();

function mapDeliveryModeToRoute(mode: DeliveryMode) {
  switch (mode) {
    case 'multiVendor':
      return 'MultiVendor';
    case 'chain':
      return 'Chain';
    case 'singleVendor':
    default:
      return 'SingleVendor';
  }
}

export default function DeliveriesNavigator() {
  const { t } = useTranslation('deliveries');
  const [initialRouteName, setInitialRouteName] = useState<'DeliveriesHome' | 'SingleVendor' | 'MultiVendor' | 'Chain' | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadInitialRoute = async () => {
      const savedMode = await getDeliveryModePreference();
      const resolvedMode = savedMode ?? DEFAULT_DELIVERY_MODE;

      if (!savedMode) {
        await setDeliveryModePreference(resolvedMode);
      }

      if (isMounted) {
        setInitialRouteName(mapDeliveryModeToRoute(resolvedMode));
      }
    };

    void loadInitialRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!initialRouteName) {
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="DeliveriesHome" options={{ title: t('header_title') }}>
        {(props) => (
          <DeliveriesHomeScreen
            {...props}
            onSelect={(type) => {
              void setDeliveryModePreference(type);
              props.navigation.replace(mapDeliveryModeToRoute(type));
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SingleVendor" component={SingleVendorNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="MultiVendor" component={MultiVendorNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Chain" component={ChainNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="ProductInfo" component={ProductInfo} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
