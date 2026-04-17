import React from 'react';
import type { ApiError } from '../../../../general/api/apiClient';
import type { HomeVisitsSeeAllFilters } from '../../components/filters/types';
import type {
  HomeVisitsSingleVendorCategoryService,
  HomeVisitsSingleVendorDeal,
  HomeVisitsSingleVendorMostPopularService,
  HomeVisitsSingleVendorNearbyService,
} from '../../singleVendor/api/types';
import useSingleVendorCategoryServices from '../../singleVendor/hooks/useSingleVendorCategoryServices';
import useSingleVendorDeals from '../../singleVendor/hooks/useSingleVendorDeals';
import useSingleVendorMostPopularServices from '../../singleVendor/hooks/useSingleVendorMostPopularServices';
import useSingleVendorNearbyServices from '../../singleVendor/hooks/useSingleVendorNearbyServices';

type HomeVisitsSeeAllItem =
  | HomeVisitsSingleVendorNearbyService
  | HomeVisitsSingleVendorMostPopularService
  | HomeVisitsSingleVendorDeal
  | HomeVisitsSingleVendorCategoryService;

type HomeVisitsSeeAllScope = 'single-vendor' | 'multi-vendor' | 'chain';

type HomeVisitsSeeAllQueryType =
  | 'nearby-services'
  | 'most-popular-services'
  | 'deals-services'
  | 'category-services';

type HomeVisitsRawQueryResult =
  | ReturnType<typeof useSingleVendorNearbyServices>
  | ReturnType<typeof useSingleVendorMostPopularServices>
  | ReturnType<typeof useSingleVendorDeals>
  | ReturnType<typeof useSingleVendorCategoryServices>;

type HomeVisitsSeeAllListQueryResult = {
  data: HomeVisitsSeeAllItem[];
  isPending: boolean;
  isError: boolean;
  error: ApiError | null;
  refetch: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => Promise<unknown> | unknown;
  isRefetching: boolean;
};

type UseHomeVisitsSeeAllScreenConfigParams = {
  enabled: boolean;
  scope: HomeVisitsSeeAllScope;
  queryType: HomeVisitsSeeAllQueryType;
  filters: HomeVisitsSeeAllFilters;
  search: string;
  categoryId?: string;
  latitude?: number;
  longitude?: number;
};

type UseHomeVisitsSeeAllScreenConfigResult = {
  listQuery: HomeVisitsSeeAllListQueryResult;
  itemKeyExtractor: (item: HomeVisitsSeeAllItem, index: number) => string;
  loadingComponent?: React.ReactNode;
  paginationLoadingComponent?: React.ReactNode;
  isNearbyLocationMissing: boolean;
};

function normalizeListQuery(query: HomeVisitsRawQueryResult): HomeVisitsSeeAllListQueryResult {
  return {
    data: (query.data ?? []) as HomeVisitsSeeAllItem[],
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

const EMPTY_QUERY_RESULT: HomeVisitsSeeAllListQueryResult = {
  data: [],
  isPending: false,
  isError: false,
  error: null,
  refetch: () => Promise.resolve(),
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: () => Promise.resolve(),
  isRefetching: false,
};

export default function useHomeVisitsSeeAllScreenConfig({
  enabled,
  scope,
  queryType,
  filters,
  search,
  categoryId,
  latitude,
  longitude,
}: UseHomeVisitsSeeAllScreenConfigParams): UseHomeVisitsSeeAllScreenConfigResult {
  const isSingleVendorScope = scope === 'single-vendor';
  const searchParam = search.trim() || undefined;

  const nearbyQuery = useSingleVendorNearbyServices(
    { latitude, longitude },
    {
      search: searchParam,
      stock: filters.stock,
      category_ids: filters.categoryIds ?? undefined,
      subcategory_id: filters.subcategoryId ?? undefined,
      price_tiers: filters.priceTiers ?? undefined,
      sort_by: filters.sortBy,
    },
    {
      enabled: enabled && isSingleVendorScope && queryType === 'nearby-services',
    },
  );

  const mostPopularQuery = useSingleVendorMostPopularServices(
    {
      search: searchParam,
      latitude,
      longitude,
      stock: filters.stock,
      category_ids: filters.categoryIds ?? undefined,
      subcategory_id: filters.subcategoryId ?? undefined,
      price_tiers: filters.priceTiers ?? undefined,
      sort_by: filters.sortBy,
    },
    {
      enabled:
        enabled && isSingleVendorScope && queryType === 'most-popular-services',
    },
  );

  const dealsQuery = useSingleVendorDeals(
    {
      search: searchParam,
      tab: filters.tab,
      category_ids: filters.categoryIds ?? undefined,
      subcategory_id: filters.subcategoryId ?? undefined,
      price_tiers: filters.priceTiers ?? undefined,
      latitude,
      longitude,
      sort_by: filters.sortBy,
    },
    {
      enabled: enabled && isSingleVendorScope && queryType === 'deals-services',
    },
  );

  const categoryQuery = useSingleVendorCategoryServices(
    categoryId,
    {
      search: searchParam,
      latitude,
      longitude,
      stock: filters.stock,
      category_ids: filters.categoryIds ?? undefined,
      subcategory_id: filters.subcategoryId ?? undefined,
      price_tiers: filters.priceTiers ?? undefined,
      sort_by: filters.sortBy,
    },
    {
      enabled: enabled && isSingleVendorScope && queryType === 'category-services',
    },
  );

  if (!isSingleVendorScope) {
    return {
      listQuery: EMPTY_QUERY_RESULT,
      itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
      loadingComponent: undefined,
      paginationLoadingComponent: undefined,
      isNearbyLocationMissing: false,
    };
  }

  if (queryType === 'nearby-services') {
    return {
      listQuery: normalizeListQuery(nearbyQuery),
      itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
      loadingComponent: undefined,
      paginationLoadingComponent: undefined,
      isNearbyLocationMissing: !nearbyQuery.isEnabled,
    };
  }

  if (queryType === 'most-popular-services') {
    return {
      listQuery: normalizeListQuery(mostPopularQuery),
      itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
      loadingComponent: undefined,
      paginationLoadingComponent: undefined,
      isNearbyLocationMissing: false,
    };
  }

  if (queryType === 'deals-services') {
    return {
      listQuery: normalizeListQuery(dealsQuery),
      itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
      loadingComponent: undefined,
      paginationLoadingComponent: undefined,
      isNearbyLocationMissing: false,
    };
  }

  return {
    listQuery: normalizeListQuery(categoryQuery),
    itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
    loadingComponent: undefined,
    paginationLoadingComponent: undefined,
    isNearbyLocationMissing: false,
  };
}
