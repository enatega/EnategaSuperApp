import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import type { DeliveryShopTypeProduct } from '../../../api/types';
import ShopTypeCardSkeleton from './HomeTabSkeletons/ShopTypeCardSkeleton';
import ProductCard from '../../../components/productCard/ProductCard';
import type { MultiVendorStackParamList } from '../../navigation/types';
import HomeSectionState from './HomeSectionState';

type Props = {
  errorMessage?: string;
  isLoading: boolean;
  products: DeliveryShopTypeProduct[];
  shopTypeId: string;
  title: string;
};

type NavProp = NativeStackNavigationProp<MultiVendorStackParamList, 'SeeAllScreen'>;

export default function ShopTypeProductList({
  errorMessage,
  isLoading,
  products,
  shopTypeId,
  title,
}: Props) {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const hasError = Boolean(errorMessage);
  const isEmpty = !isLoading && !hasError && products.length === 0;
  const handleSeeAllPress = useCallback(
    () =>
      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-products',
        title,
        cardType: 'store',
        shopTypeId,
      }),
    [navigation, shopTypeId, title],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        onActionPress={handleSeeAllPress}
        title={title}
      />

      {isLoading ? (
        <ShopTypeCardSkeleton />
      ) : hasError ? (
        <HomeSectionState
          message={errorMessage ?? t('multi_vendor_shop_type_products_error')}
          tone="error"
        />
      ) : isEmpty ? (
        <HomeSectionState message={t('multi_vendor_shop_type_products_empty')} />
      ) : (
        <HorizontalList
          data={products}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              variant="rail"
              onPress={() => navigation.navigate('ProductInfo', { productId: item.productId })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
