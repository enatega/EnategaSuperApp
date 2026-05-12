import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import DeveloperModeHomeScreen from '../screens/home/HomeScreen';
import QueryProvider from '../../../general/providers/QueryProvider';
import Text from '../../../general/components/Text';

const Stack = createNativeStackNavigator();

function FeatureUnavailableScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
      <Text weight="semiBold">This debug screen is unavailable in the current app set.</Text>
    </View>
  );
}

export default function DeveloperModeNavigator() {
  return (
    <QueryProvider>
      <Stack.Navigator>
        <Stack.Screen
          name="DeveloperModeHome"
          component={DeveloperModeHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DriverProfile"
          component={FeatureUnavailableScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RateOrder"
          component={FeatureUnavailableScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RiderChat"
          component={FeatureUnavailableScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourierDetails"
          component={FeatureUnavailableScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductInfo"
          component={FeatureUnavailableScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </QueryProvider>
  );
}
