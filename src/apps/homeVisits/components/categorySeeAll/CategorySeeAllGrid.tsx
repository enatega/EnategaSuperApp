import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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
  const numColumns = 3;

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
      key={`categories-grid:${numColumns}`}
      data={data}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<CategorySeeAllGridListHeader title={title} />}
      ListEmptyComponent={<CategorySeeAllGridEmptyState />}
      renderItem={({ item }) => (
        <View style={styles.itemColumn}>
          <CategorySeeAllGridItem item={item} onPress={onItemPress} />
        </View>
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
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  row: {
    justifyContent: 'flex-start',
  },
  itemColumn: {
    width: '33.333%',
    paddingHorizontal: 4,
    marginBottom: 24,
  },
});
