import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../general/components/discovery';
import ServicesCard from '../../components/ServicesCard';
import type { HomeVisitsSeeAllFilters } from '../../components/filters/types';
import type { HomeVisitsMultiVendorNearbyService } from '../api/types';
import useMultiVendorNearbyServices from '../hooks/useMultiVendorNearbyServices';
import type { MultiVendorStackParamList } from '../navigation/types';

type Props = {
  categoryId?: string | null;
  filters?: HomeVisitsSeeAllFilters;
  mainServiceId?: string | null;
  latitude?: number;
  longitude?: number;
  search?: string;
};

export default function NearbyServicesSection({
  categoryId,
  filters,
  latitude,
  longitude,
  mainServiceId,
  search,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const {
    data: services = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMultiVendorNearbyServices({
    search: search?.trim() || undefined,
    latitude,
    longitude,
    mainServiceId: mainServiceId ?? undefined,
    category_ids: categoryId ?? filters?.categoryIds ?? undefined,
    price_tiers: filters?.priceTiers ?? undefined,
    stock: filters?.stock,
    subcategory_id: filters?.subcategoryId ?? undefined,
    sort_by: filters?.sortBy,
  });
  const isEmpty = !isPending && !isError && services.length === 0;

  const handleSeeAll = useCallback(() => {
    navigation.navigate('MultiVendorSeeAll', {
      queryType: 'nearby-services',
      scope: 'multi-vendor',
      title: t('multi_vendor_nearby_services_title'),
      mainServiceId: mainServiceId ?? undefined,
      categoryId: categoryId ?? filters?.categoryIds ?? undefined,
      latitude,
      longitude,
      cardType: 'service',
    });
  }, [categoryId, filters?.categoryIds, latitude, longitude, mainServiceId, navigation, t]);

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsMultiVendorNearbyService }) => (
      <ServicesCard bookingFlow="multiVendor" item={item} />
    ),
    [],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={services.length > 0 ? t('single_vendor_see_all') : undefined}
        title={t('multi_vendor_nearby_services_title')}
        onActionPress={handleSeeAll}
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
          message={t('multi_vendor_nearby_services_empty')}
        />
      ) : (
        <HorizontalList
          data={services}
          keyExtractor={(item, index) =>
            `${item.productId}-${item.serviceCenterId}-${index}`
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
