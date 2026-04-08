import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../components/discovery';
import useSingleVendorCategories from '../../hooks/useSingleVendorCategories';
import useSingleVendorCategoryProductSections from '../../hooks/useSingleVendorCategoryProductSections';

export default function SingleVendorCategorySection() {
  const { t } = useTranslation('deliveries');
  const { data = [], isPending } = useSingleVendorCategories();
  const productSections = useSingleVendorCategoryProductSections(data);

  return (
    <View style={styles.content}>
      <DiscoveryCategorySection
        items={data}
        isPending={isPending}
        title={t('single_vendor_categories_title')}
      />

      {productSections.map(
        ({ category, data: products = [], error, isPending: isProductsPending }) => (
          <View key={category.id} style={styles.resultSection}>
            <DiscoveryCategoryResultsSection
              cardType="product"
              emptyMessage={t('single_vendor_category_products_empty')}
              hasError={Boolean(error)}
              isLoading={isProductsPending}
              items={products}
              title={category.name}
            />
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  resultSection: {
    paddingHorizontal: 16,
  },
});
