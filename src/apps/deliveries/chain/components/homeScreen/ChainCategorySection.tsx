import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../components/discovery';
import useChainCategoryProductSections from '../../hooks/useChainCategoryProductSections';
import useChainMenuCategories from '../../hooks/useChainMenuCategories';
import { useChainMenuStore } from '../../stores/useChainMenuStore';

type Props = {
  isTemplatePending?: boolean;
};

export default function ChainCategorySection({
  isTemplatePending = false,
}: Props) {
  const { t } = useTranslation('deliveries');
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );
  const { data = [], isPending } = useChainMenuCategories({
    menuTemplateId: selectedMenuTemplateId,
  });
  const productSections = useChainCategoryProductSections(
    data,
    selectedMenuTemplateId,
  );

  return (
    <View style={styles.content}>
      <DiscoveryCategorySection
        items={data}
        isPending={isPending || isTemplatePending}
        title={t('chain_categories_title')}
      />

      {productSections.map(
        ({ category, data: products = [], error, isPending: isProductsPending }) => (
          <View key={category.id} style={styles.resultSection}>
            <DiscoveryCategoryResultsSection
              cardType="product"
              emptyMessage={t('chain_category_products_empty')}
              hasError={Boolean(error)}
              isLoading={isTemplatePending || isProductsPending}
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
