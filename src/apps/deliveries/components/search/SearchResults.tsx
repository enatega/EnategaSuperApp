import React from 'react';
import { StyleSheet, View } from 'react-native';
import EmptySearch from '../../../../general/components/search/EmptySearch';
import SearchResultsSkeleton from './SearchResultsSkeleton';
import ProductMiniCardScroller from './ProductMiniCardScroller';
import StoreCardScroller from './StoreCardScroller';
import type { SearchResultsProps } from './types';

export default function SearchResults({
  isSearchActive,
  shouldSearchStores,
  isSearchLoading,
  hasNoResults,
  products,
  stores,
  isFetchingMoreProducts,
  isFetchingMoreStores,
  onLoadMoreProducts,
  onLoadMoreStores,
}: SearchResultsProps) {
  if (!isSearchActive) {
    return null;
  }

  if (isSearchLoading) {
    return <SearchResultsSkeleton showStores={shouldSearchStores} />;
  }

  if (hasNoResults) {
    return (
      <View style={styles.emptyContainer}>
        <EmptySearch />
      </View>
    );
  }

  if (products.length === 0 && stores.length === 0) {
    return null;
  }

  return (
    <>
      {products.length > 0 ? (
        <View style={styles.section}>
          <ProductMiniCardScroller
            products={products}
            onLoadMore={onLoadMoreProducts}
            isLoadingMore={isFetchingMoreProducts}
          />
        </View>
      ) : null}

      {shouldSearchStores && stores.length > 0 ? (
        <View style={styles.section}>
          <StoreCardScroller
            stores={stores}
            onLoadMore={onLoadMoreStores}
            isLoadingMore={isFetchingMoreStores}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    minHeight: 320,
    justifyContent: 'center',
  },
  section: {
    marginBottom: 20,
  },
});
