import React, { useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useDeliveriesCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import SeeAllMapView from '../../../../general/screens/SeeAllScreen/components/SeeAllMapView';
import type { DeliveriesSeeAllParamList, SeeAllItem } from '../../navigation/sharedTypes';
import { mapStoreFromSeeAllItem } from './components/renderers';

type SeeAllMapRouteProp = RouteProp<DeliveriesSeeAllParamList, 'SeeAllMapView'>;

export default function DeliveriesSeeAllMapView() {
  const navigation = useNavigation();
  const route = useRoute<SeeAllMapRouteProp>();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const { items, title } = route.params;

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SeeAllMapView<SeeAllItem>
      items={items}
      title={title}
      onBack={handleBack}
      currencyLabel={currencyLabel}
      mapStoreFromItem={(item) => mapStoreFromSeeAllItem(item)}
    />
  );
}
