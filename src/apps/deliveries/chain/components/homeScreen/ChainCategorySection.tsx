import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../components/discovery';
import type { DeliveriesStackParamList } from '../../../navigation/types';
import useChainCategoryProductSections from '../../hooks/useChainCategoryProductSections';
import useChainMenuCategories from '../../hooks/useChainMenuCategories';
import { useChainMenuStore } from '../../stores/useChainMenuStore';

type Props = {
  isTemplatePending?: boolean;
};

type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function ChainCategorySection({
  isTemplatePending = false,
}: Props) {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
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

  const handleSeeAllPress = () => {
    navigation.navigate('ChainCategoriesSeeAll');
  };

  const handleCategorySeeAllPress = (categoryId: string, categoryName: string) => {
    navigation.navigate('SeeAllScreen', {
      queryType: 'chain-category-products',
      title: categoryName,
      cardType: 'product',
      categoryId,
      cardVariant: 'rail',
    });
  };

  return (
    <View style={styles.content}>
      <DiscoveryCategorySection
        actionLabel={t('multi_vendor_see_all')}
        items={data}
        isPending={isPending || isTemplatePending}
        onActionPress={handleSeeAllPress}
        title={t('chain_categories_title')}
      />

      {productSections.map(
        ({ category, data: products = [], error, isPending: isProductsPending }) => (
          <View key={category.id} style={styles.resultSection}>
            <DiscoveryCategoryResultsSection
              actionLabel={t('multi_vendor_see_all')}
              cardType="product"
              emptyMessage={t('chain_category_products_empty')}
              hasError={Boolean(error)}
              isLoading={isTemplatePending || isProductsPending}
              items={products}
              onActionPress={() =>
                handleCategorySeeAllPress(category.id, category.name)
              }
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
