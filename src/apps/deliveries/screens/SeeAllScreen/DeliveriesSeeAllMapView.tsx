import React, { useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDeliveriesCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import SeeAllMapView from '../../../../general/screens/SeeAllScreen/components/SeeAllMapView';
import type { DeliveriesSeeAllParamList, SeeAllItem } from '../../navigation/sharedTypes';
import type { DeliveriesStackParamList } from '../../navigation/types';
import { mapStoreFromSeeAllItem } from './components/renderers';

type SeeAllMapRouteProp = RouteProp<DeliveriesSeeAllParamList, 'SeeAllMapView'>;
type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function DeliveriesSeeAllMapView() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SeeAllMapRouteProp>();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const { items, title } = route.params;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewStore = useCallback((storeId: string) => {
    const selectedStore = items.find(
      (item) => !('productId' in item) && item.storeId === storeId,
    );

    if (!selectedStore) {
      return;
    }

    navigation.navigate('MultiVendor', {
      screen: 'StoreDetails',
      params: { store: selectedStore },
    });
  }, [items, navigation]);

  return (
    <SeeAllMapView<SeeAllItem>
      items={items}
      title={title}
      onBack={handleBack}
      onViewStore={handleViewStore}
      currencyLabel={currencyLabel}
      mapStoreFromItem={(item) => mapStoreFromSeeAllItem(item)}
    />
  );
}
