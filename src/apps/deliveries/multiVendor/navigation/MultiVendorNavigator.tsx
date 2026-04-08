import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import MultiVendorBottomTabNavigator from './MultiVendorBottomTabNavigator';
import FavouritesScreen from '../screens/FavouritesScreen/FavouritesScreen';
import StoreDetailsScreen from '../screens/StoreDetailsScreen/StoreDetailsScreen';
import SeeAllScreen from '../screens/SeeAllScreen/SeeAllScreen';
import type { MultiVendorStackParamList } from './types';
import SeeAllMapView from '../screens/SeeAllScreen/components/SeeAllMapView';
import ProductInfo from '../../screens/ProductInfo/ProductInfo';
import ShopTypesSeeAll from '../screens/ShopTypesSeeAll/ShopTypesSeeAll';
import TopBrandsSeeAll from '../screens/TopBrandsSeeAll/TopBrandsSeeAll';

const Stack = createNativeStackNavigator<MultiVendorStackParamList>();

const hiddenHeaderOptions = { headerShown: false } as const;

export default function MultiVendorNavigator() {
  const { t } = useTranslation('deliveries');

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MultiVendorTabs"
        component={MultiVendorBottomTabNavigator}
        options={{ ...hiddenHeaderOptions, title: t('multi_vendor_tab_search') }}
      />
      <Stack.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="StoreDetails"
        component={StoreDetailsScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SeeAllScreen"
        component={SeeAllScreen}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="SeeAllMapView"
        component={SeeAllMapView}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="ProductInfo"
        component={ProductInfo}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="ShopTypesSeeAll"
        component={ShopTypesSeeAll}
        options={hiddenHeaderOptions}
      />
      <Stack.Screen
        name="TopBrandsSeeAll"
        component={TopBrandsSeeAll}
        options={hiddenHeaderOptions}
      />
    </Stack.Navigator>
  );
}
