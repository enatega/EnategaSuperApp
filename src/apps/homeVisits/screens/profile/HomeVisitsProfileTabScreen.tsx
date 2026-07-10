import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileTabScreen from '../../../../general/screens/profile/ProfileTabScreen';
import useProfile from '../../../../general/hooks/useProfile';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';

export default function HomeVisitsProfileTabScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const route = useRoute();
  const isMultiVendorTab = route.name === 'MultiVendorTabProfile';
  const flowNavigation = navigation as unknown as {
    navigate: (screen: string) => void;
  };
  const { user, wallet, isLoading } = useProfile('home-services');

  return (
    <ProfileTabScreen
      favoritesEnabled
      couponsEnabled={false}
      isLoading={isLoading}
      onOpenFavourites={() =>
        flowNavigation.navigate(
          isMultiVendorTab ? 'MultiVendorFavorites' : 'SingleVendorFavorites',
        )
      }
      onOpenNotifications={() =>
        flowNavigation.navigate(
          isMultiVendorTab
            ? 'MultiVendorNotifications'
            : 'SingleVendorNotifications',
        )
      }
      user={user}
      wallet={wallet}
    />
  );
}
