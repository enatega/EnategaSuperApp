import React, { useCallback } from 'react';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import type { MultiVendorStackParamList } from '../../../multiVendor/navigation/types';
import ProfileTabScreen from './ProfileTabScreen';

export default function MultiVendorProfileTabScreen() {
  const navigation = useNavigation<NavigationProp<MultiVendorStackParamList>>();

  const handleOpenFavourites = useCallback(() => {
    navigation.navigate('Favourites');
  }, [navigation]);

  return (
    <ProfileTabScreen
      favoritesBehavior="enabled"
      onOpenFavourites={handleOpenFavourites}
    />
  );
}
