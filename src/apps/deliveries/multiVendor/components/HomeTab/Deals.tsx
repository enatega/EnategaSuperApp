import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import type { DeliveryNearbyStore } from '../../../api/types';
import { useDeals } from '../../../hooks';
import StoreCard from '../../../components/store-card/StoreCard';
import NearbyStoreListSkeleton from './HomeTabSkeletons/NearbyStoreListSkeleton';

type Props = {
  onRestaurantPress?: (store: DeliveryNearbyStore) => void;
};

export default function Deals({ onRestaurantPress }: Props) {
  const { t } = useTranslation('deliveries');
  const { data: dealsData = [], isPending: isDealsPending } = useDeals();
  console.log('deals_Data',JSON.stringify(dealsData,null,2));
  

  const renderItem = ({ item }: { item: DeliveryNearbyStore }) => (
    <StoreCard store={item} onPress={() => onRestaurantPress?.(item)} />
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_deals_title')}
      />

      {isDealsPending ? (
        <NearbyStoreListSkeleton />
      ) : (
        <HorizontalList
          data={dealsData}
          keyExtractor={(item, index) => `${item.storeId}-${item.deal ?? item.dealAmount ?? index}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
