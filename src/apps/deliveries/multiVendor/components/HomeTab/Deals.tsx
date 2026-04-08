import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import type { DeliveryNearbyStore } from '../../../api/types';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../components/discovery';
import { useDeals } from '../../../hooks';
import StoreCard from '../../../components/storeCard/StoreCard';

export default function Deals() {
  const { t } = useTranslation('deliveries');
  const {
    data: dealsData = [],
    isPending: isDealsPending,
    isError: hasDealsError,
  } = useDeals();
  const isEmpty = !isDealsPending && !hasDealsError && dealsData.length === 0;

  const renderItem = ({ item }: { item: DeliveryNearbyStore }) => (
    <StoreCard store={item} />
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_deals_title')}
      />

      {isDealsPending ? (
        <DiscoveryResultsSkeleton />
      ) : hasDealsError ? (
        <DiscoverySectionState tone="error" />
      ) : isEmpty ? (
        <DiscoverySectionState />
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
