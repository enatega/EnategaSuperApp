import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useOrderAgain } from '../../../hooks';
import ProductCard from '../../../components/productCard/ProductCard';
import StoreMiniCardSkeleton from './HomeTabSkeletons/StoreMiniCardSkeleton';
import HomeSectionState from './HomeSectionState';

export default function OrderAgain() {
  const { t } = useTranslation('deliveries');
  const { data: orderAgainData = [], isPending: isOrderAgainPending } = useOrderAgain();

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_order_again_title')}
      />

      {isOrderAgainPending ? (
        <StoreMiniCardSkeleton />
      ) : orderAgainData.length === 0 ? (
        <HomeSectionState message={t('multi_vendor_home_section_empty_order_again')} />
      ) : (
        <HorizontalList
          data={orderAgainData}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <ProductCard product={item} variant="orderAgain" />
          )}
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
