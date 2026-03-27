import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useTopBrands } from '../../../hooks';
import TopBrandsListSkeleton from './HomeTabSkeletons/TopBrandsListSkeleton';
import TopBrandCard from '../../../components/storeCard/TopBrandCard';

export default function TopBrandsList() {
  const { t } = useTranslation('deliveries');
  const { data: topBrands = [], isPending: isTopBrandsPending } = useTopBrands();

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_top_brands_title')}
      />

      {isTopBrandsPending ? (
        <TopBrandsListSkeleton />
      ) : (
        <HorizontalList
          data={topBrands}
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
