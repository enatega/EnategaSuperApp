import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import type { DeliveryTopBrand } from '../../../api/types';
import TopBrandsListSkeleton from '../HomeTabSkeletons/TopBrandsListSkeleton';
import TopBrandCard from '../../../components/store-card/TopBrandCard';

type Props = {
  brands: DeliveryTopBrand[];
  isLoading?: boolean;
};

export default function TopBrandsList({ brands, isLoading = false }: Props) {
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_top_brands_title')}
      />

      {isLoading ? (
        <TopBrandsListSkeleton />
      ) : (
        <HorizontalList
          data={brands}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <TopBrandCard brand={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
