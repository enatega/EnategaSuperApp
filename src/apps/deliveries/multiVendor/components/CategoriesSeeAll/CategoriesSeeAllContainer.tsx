import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import CategorySeeAllGrid from '../../../components/categorySeeAll/CategorySeeAllGrid';
import type { DeliveryDiscoveryCategoryItem } from '../../../components/discovery';
import { useShopTypeCategories } from '../../../hooks';
import type { MultiVendorStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  'SeeAllScreen'
>;

type Props = {
  shopTypeId: string;
  title: string;
};

export default function CategoriesSeeAllContainer({ shopTypeId, title }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation('deliveries');
  const {
    data: categories = [],
    isPending,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useShopTypeCategories(shopTypeId, {
    mode: 'paginated',
    enabled: Boolean(shopTypeId),
  });

  const handleCategoryPress = useCallback(
    (category: DeliveryDiscoveryCategoryItem) => {
      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-stores',
        title: category.name,
        cardType: 'store',
        shopTypeId,
        categoryId: category.id,
      });
    },
    [navigation, shopTypeId],
  );

  return (
    <CategorySeeAllGrid
      data={categories.map((category) => ({
        id: category.id,
        name: category.name,
        imageUrl: category.imageUrl ?? null,
      }))}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      isRefetching={isRefetching}
      onItemPress={handleCategoryPress}
      refetch={refetch}
      title={title || t('multi_vendor_categories_title')}
    />
  );
}
