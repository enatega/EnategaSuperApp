import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../../general/components/discovery';
import type { HomeVisitsSingleVendorMostPopularService } from '../../api/types';
import useSingleVendorMostPopularServices from '../../hooks/useSingleVendorMostPopularServices';
import ServicesCard from '../../../components/ServicesCard';

export default function MostPopularServicesSection() {
  const { t } = useTranslation('homeVisits');
  const {
    data: mostPopularServices = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSingleVendorMostPopularServices();
  const isEmpty = !isPending && !isError && mostPopularServices.length === 0;

  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsSingleVendorMostPopularService }) => (
      <ServicesCard item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: HomeVisitsSingleVendorMostPopularService) =>
      `${item.productId}-${item.serviceCenterId}`,
    [],
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={t('single_vendor_most_popular_services_title')}
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
          data={mostPopularServices}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
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
