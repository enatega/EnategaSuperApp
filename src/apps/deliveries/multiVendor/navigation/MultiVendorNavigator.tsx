import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MultiVendorHomeScreen from '../screens/HomeScreen';
import MultiVendorDeliveryDetails from '../screens/DeliveryDetails';
import { useTranslation } from 'react-i18next';
import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';
import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function MultiVendorNavigator() {
  const { t } = useTranslation('deliveries');
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="MultiVendorHome"
        component={MultiVendorHomeScreen}
        options={{ title: t('multi_vendor_title') }}
      />
      <Stack.Screen
        name="MultiVendorDetails"
        component={MultiVendorDeliveryDetails}
        options={{ title: t('details_title') }}
      /> */}
      <Stack.Screen
        name="MultiVendorTabs"
        component={MultiVendorBottomTabNavigator}
        options={{ title: t('multi_vendor_tab_search'), headerShown: false }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
