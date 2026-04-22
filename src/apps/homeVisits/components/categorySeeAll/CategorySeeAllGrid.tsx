import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { HomeVisitsSingleVendorCategory } from '../../singleVendor/api/types';
import CategorySeeAllGridEmptyState from './CategorySeeAllGridEmptyState';
import CategorySeeAllGridErrorState from './CategorySeeAllGridErrorState';
import CategorySeeAllGridItem from './CategorySeeAllGridItem';
import CategorySeeAllGridListHeader from './CategorySeeAllGridListHeader';
import CategorySeeAllGridSkeleton from './CategorySeeAllGridSkeleton';

type Props = {
  data: HomeVisitsSingleVendorCategory[];
  fetchNextPage: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
  isRefetching: boolean;
  onItemPress: (item: HomeVisitsSingleVendorCategory) => void;
  refetch: () => Promise<unknown> | unknown;
  title: string;
};

export default function CategorySeeAllGrid({
  data,
  fetchNextPage,
  hasNextPage,
  isError,
  isFetchingNextPage,
  isPending,
  isRefetching,
  onItemPress,
  refetch,
  title,
}: Props) {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <CategorySeeAllGridSkeleton />;
  }

  if (isError) {
    return (
      <CategorySeeAllGridErrorState
        isRetrying={isRefetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <FlatList
      data={data}
      numColumns={3}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<CategorySeeAllGridListHeader title={title} />}
      ListEmptyComponent={<CategorySeeAllGridEmptyState />}
      renderItem={({ item }) => (
        <CategorySeeAllGridItem item={item} onPress={onItemPress} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  row: {
    columnGap: 10,
    marginBottom: 28,
  },
});
