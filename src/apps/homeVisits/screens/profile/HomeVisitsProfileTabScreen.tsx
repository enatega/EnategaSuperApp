import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileTabScreen from '../../../../general/screens/profile/ProfileTabScreen';
import useProfile from '../../../../general/hooks/useProfile';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';

export default function HomeVisitsProfileTabScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const { user, wallet, isLoading } = useProfile('home-services');

  return (
    <ProfileTabScreen
      favoritesEnabled
      isLoading={isLoading}
      onOpenFavourites={() => navigation.navigate('SingleVendorFavorites')}
      user={user}
      wallet={wallet}
    />
  );
}
