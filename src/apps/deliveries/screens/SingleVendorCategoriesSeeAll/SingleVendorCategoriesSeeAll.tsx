import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { useTheme } from '../../../../general/theme/theme';
import CategorySeeAllGrid from '../../components/categorySeeAll/CategorySeeAllGrid';
import type { DeliveryDiscoveryCategoryItem } from '../../components/discovery';
import type { DeliveriesStackParamList } from '../../navigation/types';
import useSingleVendorCategories from '../../singleVendor/hooks/useSingleVendorCategories';

type NavigationProp = NativeStackNavigationProp<
  DeliveriesStackParamList,
  'SingleVendorCategoriesSeeAll'
>;

export default function SingleVendorCategoriesSeeAll() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const {
    data: categories = [],
    isPending,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useSingleVendorCategories({
    mode: 'paginated',
  });

  const handleCategoryPress = useCallback(
    (category: DeliveryDiscoveryCategoryItem) => {
      navigation.navigate('SingleVendorCategoryProductsSeeAll', {
        categoryId: category.id,
        title: category.name,
      });
    },
    [navigation],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader showBack={navigation.canGoBack()} />
      <CategorySeeAllGrid
        data={categories}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        isRefetching={isRefetching}
        onItemPress={handleCategoryPress}
        refetch={refetch}
        title={t('single_vendor_categories_title')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
