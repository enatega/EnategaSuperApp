import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { CategorySeeAllGrid } from '../../components/categorySeeAll';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsSingleVendorCategory } from '../../singleVendor/api/types';
import useSingleVendorCategories from '../../singleVendor/hooks/useSingleVendorCategories';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import HomeVisitsSearchInput from '../../components/search/HomeVisitsSearchInput';
import Icon from '../../../../general/components/Icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorCategoriesSeeAll'
>;

export default function SingleVendorCategoriesSeeAll() {
  const { colors } = useTheme();
  const { t } = useTranslation(['homeVisits', 'general']);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
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
  const filteredCategories = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase();

    if (!normalizedSearchQuery) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(normalizedSearchQuery)
    );
  }, [categories, searchQuery]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topRow,
          {
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: colors.backgroundTertiary, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          <Icon type="Ionicons" name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <HomeVisitsSearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('general:generic_list_search_placeholder')}
          containerStyle={styles.searchInput}
        />
      </View>
      <CategorySeeAllGrid
        data={filteredCategories}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  searchInput: {
    width: '72%',
  },
});
