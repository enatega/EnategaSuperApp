import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../../../general/components/discovery';
import ProductCard from '../../../components/productCard/ProductCard';
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
              title={category.name}
              actionLabel={t('multi_vendor_see_all')}
              items={products}
              hasError={Boolean(error)}
              isLoading={isTemplatePending || isProductsPending}
              keyExtractor={(item) => `${item.productId}-${item.storeId}`}
              renderItem={(item) => <ProductCard product={item} variant="rail" />}
              onActionPress={() =>
                handleCategorySeeAllPress(category.id, category.name)
              }
              emptyState={{
                title: t('multi_vendor_home_section_empty_title'),
                message: t('chain_category_products_empty'),
              }}
              errorState={{
                title: t('multi_vendor_home_section_error_title'),
                message: t('multi_vendor_home_section_error_message'),
              }}
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
