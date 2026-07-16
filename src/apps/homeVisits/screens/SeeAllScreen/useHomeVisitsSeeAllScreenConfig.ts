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
import useMultiVendorNearbyServices from '../../multiVendor/hooks/useMultiVendorNearbyServices';
import type { HomeVisitsMultiVendorNearbyService } from '../../multiVendor/api/types';
import useChainCategoryServices from '../../chain/hooks/useChainCategoryServices';
import useChainDeals from '../../chain/hooks/useChainDeals';

type HomeVisitsSeeAllItem =
  | HomeVisitsSingleVendorNearbyService
  | HomeVisitsSingleVendorMostPopularService
  | HomeVisitsSingleVendorDeal
  | HomeVisitsSingleVendorCategoryService
  | HomeVisitsMultiVendorNearbyService;

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
  | ReturnType<typeof useSingleVendorCategoryServices>
  | ReturnType<typeof useMultiVendorNearbyServices>
  | ReturnType<typeof useChainCategoryServices>
  | ReturnType<typeof useChainDeals>;

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
  mainServiceId?: string;
  providerId?: string;
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
  mainServiceId,
  providerId,
  latitude,
  longitude,
}: UseHomeVisitsSeeAllScreenConfigParams): UseHomeVisitsSeeAllScreenConfigResult {
  const isSingleVendorScope = scope === 'single-vendor';
  const isMultiVendorScope = scope === 'multi-vendor';
  const isChainScope = scope === 'chain';
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
      category_ids: categoryId ?? filters.categoryIds ?? undefined,
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

  const multiVendorNearbyQuery = useMultiVendorNearbyServices(
    {
      search: searchParam,
      mainServiceId,
      providerId,
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
        enabled && isMultiVendorScope && queryType === 'nearby-services',
    },
  );

  const chainDealsQuery = useChainDeals(
    {
      search: searchParam,
      category_ids: filters.categoryIds ?? undefined,
      subcategory_id: filters.subcategoryId ?? undefined,
      price_tiers: filters.priceTiers ?? undefined,
      latitude,
      longitude,
      sort_by: filters.sortBy,
    },
    {
      enabled: enabled && isChainScope && queryType === 'deals-services',
      mode: 'paginated',
      tab: filters.tab,
    },
  );

  const chainCategoryServicesQuery = useChainCategoryServices(
    categoryId ?? '',
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
        enabled &&
        isChainScope &&
        queryType === 'category-services' &&
        Boolean(categoryId),
      mode: 'paginated',
    },
  );

  if (isMultiVendorScope && queryType === 'nearby-services') {
    return {
      listQuery: normalizeListQuery(multiVendorNearbyQuery),
      itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
      loadingComponent: undefined,
      paginationLoadingComponent: undefined,
      isNearbyLocationMissing: false,
    };
  }

  if (!isSingleVendorScope) {
    if (isChainScope && queryType === 'deals-services') {
      return {
        listQuery: normalizeListQuery(chainDealsQuery),
        itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
        loadingComponent: undefined,
        paginationLoadingComponent: undefined,
        isNearbyLocationMissing: false,
      };
    }

    if (isChainScope && queryType === 'category-services') {
      return {
        listQuery: normalizeListQuery(chainCategoryServicesQuery),
        itemKeyExtractor: (item, index) => `${item.productId}-${item.serviceCenterId}-${index}`,
        loadingComponent: undefined,
        paginationLoadingComponent: undefined,
        isNearbyLocationMissing: false,
      };
    }

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
