import React from 'react';
import type { ApiError } from '../../../../general/api/apiClient';
import type { GenericListFilters } from '../../components/filters';
import {
  useNearbyStores,
  useShopTypeProducts,
  useShopTypeStores,
  useVendorStores,
} from '../../hooks';
import useChainCategoryProducts from '../../chain/hooks/useChainCategoryProducts';
import useSingleVendorCategoryProducts from '../../singleVendor/hooks/useSingleVendorCategoryProducts';
import VerticalStoreListSkeleton from '../../components/VerticalStoreListSkeleton';
import type {
  DeliveriesSeeAllParamList,
  SeeAllItem,
} from '../../navigation/sharedTypes';

type SeeAllRawQueryResult =
  | ReturnType<typeof useNearbyStores>
  | ReturnType<typeof useChainCategoryProducts>
  | ReturnType<typeof useShopTypeProducts>
  | ReturnType<typeof useShopTypeStores>
  | ReturnType<typeof useVendorStores>
  | ReturnType<typeof useSingleVendorCategoryProducts>;

type SeeAllListQueryResult = {
  data: SeeAllItem[];
  totalCount?: number;
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: SeeAllRawQueryResult['refetch'];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: SeeAllRawQueryResult['fetchNextPage'];
  isRefetching: boolean;
};

type UseSeeAllScreenConfigParams = {
  enabled: boolean;
  filters: GenericListFilters;
  search: string;
  queryType: DeliveriesSeeAllParamList['SeeAllScreen']['queryType'];
  shopTypeId?: string;
  vendorId?: string;
  categoryId?: string;
};

type UseSeeAllScreenConfigResult = {
  itemKeyExtractor: (item: SeeAllItem, index: number) => string;
  listQuery: SeeAllListQueryResult;
  loadingComponent: React.ReactNode;
  paginationLoadingComponent: React.ReactNode;
};

const STORE_LIST_SKELETON: React.ReactNode =
  React.createElement(VerticalStoreListSkeleton);

function normalizeListQuery(query: SeeAllRawQueryResult): SeeAllListQueryResult {
  return {
    data: (query.data ?? []) as SeeAllItem[],
    totalCount: query.totalCount,
    isPending: query.isPending,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: query.fetchNextPage,
    isRefetching: query.isRefetching,
  };
}

export default function useSeeAllScreenConfig({
  enabled,
  filters,
  search,
  queryType,
  shopTypeId,
  vendorId,
  categoryId,
}: UseSeeAllScreenConfigParams): UseSeeAllScreenConfigResult {
  const nearbyStoresQuery = useNearbyStores({
    mode: 'paginated',
    enabled: enabled && queryType === 'nearby-stores',
    filters,
    search,
  });
  const shopTypeProductsQuery = useShopTypeProducts(shopTypeId ?? '', {
    mode: 'paginated',
    enabled: enabled && queryType === 'shop-type-products' && Boolean(shopTypeId),
    filters,
    search,
  });
  const shopTypeStoresQuery = useShopTypeStores(shopTypeId ?? '', {
    mode: 'paginated',
    enabled: enabled && queryType === 'shop-type-stores' && Boolean(shopTypeId),
    filters,
    search,
  });
  const vendorStoresQuery = useVendorStores(vendorId ?? '', {
    mode: 'paginated',
    enabled: enabled && queryType === 'top-brand-stores' && Boolean(vendorId),
    filters,
    search,
  });
  const singleVendorCategoryProductsQuery = useSingleVendorCategoryProducts(
    categoryId ?? '',
    {
      mode: 'paginated',
      enabled:
        enabled &&
        queryType === 'single-vendor-category-products' &&
        Boolean(categoryId),
      filters,
      search,
    },
  );
  const chainCategoryProductsQuery = useChainCategoryProducts(categoryId ?? '', {
    mode: 'paginated',
    enabled:
      enabled &&
      queryType === 'chain-category-products' &&
      Boolean(categoryId),
    search,
  });

  if (queryType === 'shop-type-stores') {
    return {
      itemKeyExtractor: (item, index) => `${item.storeId}-${index}`,
      listQuery: normalizeListQuery(shopTypeStoresQuery),
      loadingComponent: STORE_LIST_SKELETON,
      paginationLoadingComponent: STORE_LIST_SKELETON,
    };
  }

  if (queryType === 'shop-type-products') {
    return {
      itemKeyExtractor: (item, index) =>
        'productId' in item
          ? `${item.productId}-${item.storeId}-${index}`
          : `${item.storeId}-${index}`,
      listQuery: normalizeListQuery(shopTypeProductsQuery),
      loadingComponent: STORE_LIST_SKELETON,
      paginationLoadingComponent: STORE_LIST_SKELETON,
    };
  }

  if (queryType === 'top-brand-stores') {
    return {
      itemKeyExtractor: (item, index) => `${item.storeId}-${index}`,
      listQuery: normalizeListQuery(vendorStoresQuery),
      loadingComponent: STORE_LIST_SKELETON,
      paginationLoadingComponent: STORE_LIST_SKELETON,
    };
  }

  if (queryType === 'single-vendor-category-products') {
    return {
      itemKeyExtractor: (item, index) =>
        'productId' in item
          ? `${item.productId}-${item.storeId}-${index}`
          : `${item.storeId}-${index}`,
      listQuery: normalizeListQuery(singleVendorCategoryProductsQuery),
      loadingComponent: STORE_LIST_SKELETON,
      paginationLoadingComponent: STORE_LIST_SKELETON,
    };
  }

  if (queryType === 'chain-category-products') {
    return {
      itemKeyExtractor: (item, index) =>
        'productId' in item
          ? `${item.productId}-${item.storeId}-${index}`
          : `${item.storeId}-${index}`,
      listQuery: normalizeListQuery(chainCategoryProductsQuery),
      loadingComponent: STORE_LIST_SKELETON,
      paginationLoadingComponent: STORE_LIST_SKELETON,
    };
  }

  return {
    itemKeyExtractor: (item, index) =>
      'productId' in item ? `${item.productId}-${index}` : item.storeId,
    listQuery: normalizeListQuery(nearbyStoresQuery),
    loadingComponent: STORE_LIST_SKELETON,
    paginationLoadingComponent: STORE_LIST_SKELETON,
  };
}
