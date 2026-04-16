import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from '../../../../../general/components/discovery';
import type { DeliveryShopTypeProduct } from '../../../api/types';
import ProductCard from '../../../components/productCard/ProductCard';
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
        cardVariant: 'rail',
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
              title={category.name}
              actionLabel={t('multi_vendor_see_all')}
              items={products}
              hasError={Boolean(error)}
              isLoading={isProductsPending}
              keyExtractor={(item) =>
                `${item.productId}-${(item as DeliveryShopTypeProduct).storeId}`
              }
              renderItem={(item) => <ProductCard product={item} variant="rail" />}
              onActionPress={() =>
                handleCategorySeeAllPress(category.id, category.name)
              }
              emptyState={{
                title: t('multi_vendor_home_section_empty_title'),
                message: t('single_vendor_category_products_empty'),
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
