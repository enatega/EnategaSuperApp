import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../../general/components/discovery';
import type { HomeVisitsSingleVendorDeal } from '../../api/types';
import useSingleVendorDeals from '../../hooks/useSingleVendorDeals';
import ServicesCard from '../../../components/ServicesCard';

export default function DealsSection() {
  const { t } = useTranslation('homeVisits');
  const { data: deals = [], isPending, isError } = useSingleVendorDeals();
  const isEmpty = !isPending && !isError && deals.length === 0;

  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsSingleVendorDeal }) => (
      <ServicesCard item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: HomeVisitsSingleVendorDeal) => `${item.productId}-${item.serviceCenterId}`,
    [],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={t('single_vendor_deals_title')}
        actionLabel={t('single_vendor_see_all')}
      />

      {isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('single_vendor_home_section_error_title')}
          message={t('single_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={t('single_vendor_home_section_empty_title')}
          message={t('single_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={deals}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
