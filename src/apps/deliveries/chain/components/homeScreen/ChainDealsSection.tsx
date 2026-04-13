import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Deals from '../../../components/deals/Deals';
import type { SearchStoreItem } from '../../../api/searchServiceTypes';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../../api/types';
import type { DeliveriesStackParamList } from '../../../navigation/types';
import useChainDeals from '../../hooks/useChainDeals';

type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;
type DealsItem = DeliveryNearbyStore | SearchStoreItem | DeliveryShopTypeProduct;
type Props = {
  isTemplatePending?: boolean;
};

function isProductDealsItem(item: DealsItem): item is DeliveryShopTypeProduct {
  return 'productId' in item && 'productName' in item;
}

export default function ChainDealsSection({
  isTemplatePending = false,
}: Props) {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const {
    data: dealsData = [],
    isPending: isDealsPending,
    isError: hasDealsError,
  } = useChainDeals();

  const handleItemPress = useCallback(
    (item: DealsItem) => {
      if (!isProductDealsItem(item)) {
        return;
      }

      navigation.navigate('ProductInfo', { productId: item.productId });
    },
    [navigation],
  );

  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('DealsSeeAll', { source: 'chain-vendor' });
  }, [navigation]);

  return (
    <Deals
      actionLabel={t('multi_vendor_see_all')}
      isError={hasDealsError}
      isPending={isTemplatePending || isDealsPending}
      items={dealsData}
      onActionPress={handleSeeAllPress}
      onItemPress={handleItemPress}
      title={t('multi_vendor_deals_title')}
    />
  );
}
