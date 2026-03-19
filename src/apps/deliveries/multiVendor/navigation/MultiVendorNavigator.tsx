import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MultiVendorHomeScreen from '../screens/HomeScreen';
import MultiVendorDeliveryDetails from '../screens/DeliveryDetails';
import { useTranslation } from 'react-i18next';
import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';
import MyProfileScreen from '../screens/MyProfileScreen/MyProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen/EditProfileScreen';
import AddressSearchScreen from '../../screens/addresses/AddressSearchScreen';
import AddressChooseOnMapScreen from '../../screens/addresses/AddressChooseOnMapScreen';
import AddressDetailScreen from '../../screens/addresses/AddressDetailScreen';
import FavouritesScreen from '../screens/FavouritesScreen/FavouritesScreen';
import RateOrderScreen from '../../screens/RateOrderScreen/RateOrderScreen';
import SeeAllScreen from '../screens/SeeAllScreen/SeeAllScreen';
import type { MultiVendorStackParamList } from './types';
import SeeAllMapView from '../screens/SeeAllScreen/components/SeeAllMapView';

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();

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
      <Stack.Screen
        name="AddressSearch"
        component={AddressSearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressChooseOnMap"
        component={AddressChooseOnMapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddressDetail"
        component={AddressDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RateOrder"
        component={RateOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeAllScreen"
        component={SeeAllScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SeeAllMapView"
        component={SeeAllMapView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
