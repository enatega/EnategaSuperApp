import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../components/discovery';
import type { DeliveriesStackParamList } from '../../../navigation/types';
import useSingleVendorCategories from '../../hooks/useSingleVendorCategories';
import useSingleVendorCategoryProductSections from '../../hooks/useSingleVendorCategoryProductSections';

type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function SingleVendorCategorySection() {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const { data = [], isPending } = useSingleVendorCategories();
  const productSections = useSingleVendorCategoryProductSections(data);
  
  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('SingleVendorCategoriesSeeAll');
  }, [navigation]);

  const handleCategorySeeAllPress = useCallback(
    (categoryId: string, categoryName: string) => {
      navigation.navigate('SeeAllScreen', {
        queryType: 'single-vendor-category-products',
        title: categoryName,
        cardType: 'product',
        categoryId,
        cardVariant:'rail',
        
      
      });
    },
    [navigation],
  );

  return (
    <View style={styles.content}>
      <DiscoveryCategorySection
        actionLabel={t('multi_vendor_see_all')}
        items={data}
        isPending={isPending}
        onActionPress={handleSeeAllPress}
        title={t('single_vendor_categories_title')}
      />

      {productSections.map(
        ({ category, data: products = [], error, isPending: isProductsPending }) => (
          <View key={category.id} style={styles.resultSection}>
            <DiscoveryCategoryResultsSection
              actionLabel={t('multi_vendor_see_all')}
              cardType="product"
              emptyMessage={t('single_vendor_category_products_empty')}
              hasError={Boolean(error)}
              isLoading={isProductsPending}
              items={products}
              onActionPress={() => handleCategorySeeAllPress(category.id, category.name)}
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
