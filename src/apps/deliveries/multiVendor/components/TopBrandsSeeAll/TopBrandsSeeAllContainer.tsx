import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet } from 'react-native';
import useDebouncedValue from '../../../../../general/hooks/useDebouncedValue';
import type { DeliveryTopBrand } from '../../../api/types';
import { discoveryService } from '../../../api/discoveryService';
import { useNearbyStores, usePaginatedTopBrands } from '../../../hooks';
import TopBrandsSeeAllEmptyState from './TopBrandsSeeAllEmptyState';
import TopBrandsSeeAllErrorState from './TopBrandsSeeAllErrorState';
import TopBrandsSeeAllItem from './TopBrandsSeeAllItem';
import TopBrandsSeeAllSkeleton from './TopBrandsSeeAllSkeleton';
import type { MultiVendorStackParamList } from '../../navigation/types';

type TopBrandsSeeAllContainerProps = {
  searchValue: string;
};

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList
>;

export default function TopBrandsSeeAllContainer({
  searchValue,
}: TopBrandsSeeAllContainerProps) {
  const navigation = useNavigation<NavigationProp>();
  const debouncedSearchValue = useDebouncedValue(searchValue.trim(), 500);
  const { data: nearbyStores = [] } = useNearbyStores();
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

  const resolveStoreFromBrand = useCallback((brand: DeliveryTopBrand) => {
    const normalizedBrandName = brand.name.trim().toLowerCase();

    const exactMatch = nearbyStores.find(
      (store) => store.name.trim().toLowerCase() === normalizedBrandName,
    );

    if (exactMatch) {
      return exactMatch;
    }

    return nearbyStores.find((store) =>
      store.name.trim().toLowerCase().includes(normalizedBrandName),
    );
  }, [nearbyStores]);

  const handleBrandPress = useCallback(
    async (brand: DeliveryTopBrand) => {
      const matchedStore = resolveStoreFromBrand(brand);

      if (matchedStore) {
        navigation.navigate('StoreDetails', { store: matchedStore });
        return;
      }

      if (!brand.vendorId) {
        return;
      }

      try {
        const vendorStores = await discoveryService.getVendorStores({
          vendorId: brand.vendorId,
          offset: 0,
          limit: 20,
        });
        const normalizedBrandName = brand.name.trim().toLowerCase();

        const byVendorAndName = vendorStores.find((store) =>
          store.vendorId === brand.vendorId &&
          store.name.trim().toLowerCase() === normalizedBrandName,
        );

        const byVendorContainsName = vendorStores.find((store) =>
          store.vendorId === brand.vendorId &&
          store.name.trim().toLowerCase().includes(normalizedBrandName),
        );

        const byVendorOnly = vendorStores.find(
          (store) => store.vendorId === brand.vendorId,
        );

        const resolvedStore = byVendorAndName ?? byVendorContainsName ?? byVendorOnly;
        if (resolvedStore) {
          navigation.navigate('StoreDetails', { store: resolvedStore });
          return;
        }
      } catch {
        // Fall through to the See All fallback below.
      }

      navigation.navigate('SeeAllScreen', {
        queryType: 'top-brand-stores',
        title: brand.name,
        cardType: 'store',
        vendorId: brand.vendorId,
      });
    },
    [navigation, resolveStoreFromBrand],
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
