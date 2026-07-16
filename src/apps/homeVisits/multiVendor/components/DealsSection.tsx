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
import type { HomeVisitsMultiVendorDeal } from '../api/types';
import useMultiVendorDeals from '../hooks/useMultiVendorDeals';
import type { MultiVendorStackParamList } from '../navigation/types';

type Props = {
  categoryId?: string | null;
  filters?: HomeVisitsSeeAllFilters;
  mainServiceId?: string | null;
  latitude?: number;
  longitude?: number;
  search?: string;
};

export default function DealsSection({
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
    data: deals = [],
    isPending,
    isError,
  } = useMultiVendorDeals({
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
  const isEmpty = !isPending && !isError && deals.length === 0;

  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsMultiVendorDeal }) => (
      <ServicesCard
        item={item}
        onPress={() =>
          navigation.navigate('MultiVendorCenterDetails', {
            provider: {
              id: item.serviceCenterId,
              serviceCenterId: item.serviceCenterId,
              name: item.storeName || item.productName,
              imageUrl: item.storeImage || item.productImage || item.storeLogo,
              logoUrl: item.storeLogo,
              coverImageUrl: item.storeImage || item.productImage,
              averageRating: item.averageRating,
              reviewCount: item.reviewCount,
              startingPrice: item.price,
            },
          })
        }
      />
    ),
    [navigation],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader title={t('multi_vendor_deals_title')} />

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
          message={t('multi_vendor_deals_empty')}
        />
      ) : (
        <HorizontalList
          data={deals}
          keyExtractor={(item, index) =>
            `${item.productId}-${item.serviceCenterId}-${index}`
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
