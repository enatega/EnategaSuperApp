import React, { useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryShopTypeProduct } from '../../api/types';
import { GenericFilterablePaginatedListScreen } from '../../components/filterablePaginatedList';
import type { DeliveriesStackParamList } from '../../navigation/types';
import useSingleVendorCategoryProducts from '../../singleVendor/hooks/useSingleVendorCategoryProducts';

type NavigationProp = NativeStackNavigationProp<
  DeliveriesStackParamList,
  'SingleVendorCategoryProductsSeeAll'
>;

export default function SingleVendorCategoryProductsSeeAll() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const route =
    useRoute<RouteProp<DeliveriesStackParamList, 'SingleVendorCategoryProductsSeeAll'>>();
  const { categoryId, title } = route.params;
  const {
    data: products = [],
    totalCount,
    isPending,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
  } = useSingleVendorCategoryProducts(categoryId, {
    mode: 'paginated',
  });

  const handleProductPress = useCallback(
    (product: DeliveryShopTypeProduct) => {
      navigation.navigate('ProductInfo', { productId: product.productId });
    },
    [navigation],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <GenericFilterablePaginatedListScreen<DeliveryShopTypeProduct, 'store'>
        title={title}
        cardType="store"
        data={products}
        totalCount={totalCount}
        isPending={isPending}
        isError={isError}
        error={error}
        refetch={refetch}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isRefetching={isRefetching}
        itemKeyExtractor={(item, index) =>
          `${item.productId}-${item.storeId}-${index}`
        }
        onItemPress={handleProductPress}
        header={<ScreenHeader showBack={navigation.canGoBack()} />}
        emptyTitle={t('generic_list_empty_title')}
        emptyDescription={t('single_vendor_category_products_empty')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
