import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet } from 'react-native';
import useDebouncedValue from '../../../../../general/hooks/useDebouncedValue';
import type { DeliveryTopBrand } from '../../../api/types';
import { usePaginatedTopBrands } from '../../../hooks';
import TopBrandsSeeAllEmptyState from './TopBrandsSeeAllEmptyState';
import TopBrandsSeeAllErrorState from './TopBrandsSeeAllErrorState';
import TopBrandsSeeAllItem from './TopBrandsSeeAllItem';
import TopBrandsSeeAllSkeleton from './TopBrandsSeeAllSkeleton';
import type { MultiVendorStackParamList } from '../../navigation/types';

type TopBrandsSeeAllContainerProps = {
  searchValue: string;
};

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  'SeeAllScreen'
>;

export default function TopBrandsSeeAllContainer({
  searchValue,
}: TopBrandsSeeAllContainerProps) {
  const navigation = useNavigation<NavigationProp>();
  const debouncedSearchValue = useDebouncedValue(searchValue.trim(), 500);
  const {
    data: topBrands = [],
    isPending,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = usePaginatedTopBrands({
    mode: 'paginated',
    search: debouncedSearchValue,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleBrandPress = useCallback(
    (brand: DeliveryTopBrand) => {
      if (!brand.vendorId) {
        return;
      }

      navigation.navigate('SeeAllScreen', {
        queryType: 'top-brand-stores',
        title: brand.name,
        cardType: 'store',
        vendorId: brand.vendorId,
      });
    },
    [navigation],
  );

  if (isPending) {
    return <TopBrandsSeeAllSkeleton />;
  }

  if (isError) {
    return (
      <TopBrandsSeeAllErrorState
        isRetrying={isRefetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <FlatList
      data={topBrands}
      numColumns={2}
      keyExtractor={(item, index) => `${item.name}-${index}`}
      renderItem={({ item }) => (
        <TopBrandsSeeAllItem brand={item} onPress={handleBrandPress} />
      )}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={<TopBrandsSeeAllEmptyState />}
      contentContainerStyle={styles.emptyContent}
      columnWrapperStyle={styles.row}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
