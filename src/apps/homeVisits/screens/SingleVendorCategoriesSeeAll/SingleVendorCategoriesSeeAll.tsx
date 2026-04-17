import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { CategorySeeAllGrid } from '../../components/categorySeeAll';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsSingleVendorCategory } from '../../singleVendor/api/types';
import useSingleVendorCategories from '../../singleVendor/hooks/useSingleVendorCategories';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';

type NavigationProp = NativeStackNavigationProp<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorCategoriesSeeAll'
>;

export default function SingleVendorCategoriesSeeAll() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
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
    (category: HomeVisitsSingleVendorCategory) => {
      navigation.navigate('SeeAllScreen', {
        scope: 'single-vendor',
        queryType: 'category-services',
        title: category.name,
        cardType: 'service',
        categoryId: category.id,
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
