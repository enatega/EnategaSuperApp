import React from 'react';
import { StyleSheet, View } from 'react-native';
import GenericSearchResults from '../../../../general/components/search/GenericSearchResults';
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
  const skeletonComponent = <SearchResultsSkeleton showStores={shouldSearchStores} />;
  
  const resultsContent = (
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

  return (
    <GenericSearchResults
      isSearchActive={isSearchActive}
      isSearchLoading={isSearchLoading}
      hasNoResults={hasNoResults}
      skeletonComponent={skeletonComponent}
    >
      {(products.length > 0 || stores.length > 0) ? resultsContent : null}
    </GenericSearchResults>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
});
