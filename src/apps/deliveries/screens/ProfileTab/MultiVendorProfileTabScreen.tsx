import React, { useCallback } from 'react';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import type { MultiVendorStackParamList } from '../../multiVendor/navigation/types';
import type { DeliveriesStackParamList } from '../../navigation/types';
import DeliveriesProfileTabScreen from '../profile/DeliveriesProfileTabScreen';

export default function MultiVendorProfileTabScreen() {
  const navigation = useNavigation<
    NavigationProp<MultiVendorStackParamList & DeliveriesStackParamList>
  >();

  const handleOpenFavourites = useCallback(() => {
    navigation.navigate('Favourites');
  }, [navigation]);

  return (
    <DeliveriesProfileTabScreen
      favoritesEnabled
      onOpenFavourites={handleOpenFavourites}
    />
  );
}
