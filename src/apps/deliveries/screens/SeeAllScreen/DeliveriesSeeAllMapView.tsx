import React, { useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDeliveriesCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import SeeAllMapView from '../../../../general/screens/SeeAllScreen/components/SeeAllMapView';
import type { DeliveriesSeeAllParamList, SeeAllItem } from '../../navigation/sharedTypes';
import { mapStoreFromSeeAllItem } from './components/renderers';
import type { DeliveryNearbyStore } from '../../api/types';

type SeeAllMapRouteProp = RouteProp<DeliveriesSeeAllParamList, 'SeeAllMapView'>;

export default function DeliveriesSeeAllMapView() {
  const navigation = useNavigation();
  const route = useRoute<SeeAllMapRouteProp>();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const { items, title } = route.params;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewStore = useCallback(
    (item: SeeAllItem) => {
      if (!('storeId' in item) || 'productId' in item) {
        return;
      }

      navigation.navigate('StoreDetails', { store: item as DeliveryNearbyStore });
    },
    [navigation],
  );

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
