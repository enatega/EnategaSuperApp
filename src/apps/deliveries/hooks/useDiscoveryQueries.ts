import {
  InfiniteData,
  useInfiniteQuery,
  useQueries,
 
  useQuery,
  type UseInfiniteQueryOptions,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { discoveryService } from '../api/discoveryService';
import { deliveryKeys } from '../api/queryKeys';
import type { GenericListFilters } from '../components/filters/types';
import useAddress from './useAddress';
import type {
  DeliveryBanner,
  DeliveryNearbyStore,
  DeliveryOrderAgainItem,
  DeliveryStoreProductsApiResponse,
  DeliveryStoreProductsParams,
  DeliveryStoreViewApiResponse,
  DeliveryNearbyStoresParams,
  PaginatedDeliveryResponse,
  DeliveryShopTypeProduct,
  DeliveryShopType,
  DeliveryTopBrand,
  DeliveryShopTypeProductsParams,
} from '../api/types';

type UseShopTypesOptions = Omit<
  UseQueryOptions<DeliveryShopType[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseMobileBannersOptions = Omit<
  UseQueryOptions<DeliveryBanner[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseTopBrandsOptions = Omit<
  UseQueryOptions<DeliveryTopBrand[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseNearbyStoresMode = 'preview' | 'paginated';

type UseNearbyStoresOptions = {
  filters?: GenericListFilters;
  mode?: UseNearbyStoresMode;
  enabled?: boolean;
  search?: string;
  requestParams?: Omit<
    DeliveryNearbyStoresParams,
    'offset' | 'limit' | 'search'
  >;
};

type UseStoreViewOptions = Omit<
  UseQueryOptions<DeliveryStoreViewApiResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

type UseStoreProductsOptions = Omit<
  UseInfiniteQueryOptions<
    DeliveryStoreProductsApiResponse,
    ApiError,
    InfiniteData<DeliveryStoreProductsApiResponse>,
    ReturnType<typeof deliveryKeys.storeProducts>,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

type UseStoreProductsParams = Omit<DeliveryStoreProductsParams, 'offset'>;

type UseDealsOptions = Omit<
  UseQueryOptions<DeliveryNearbyStore[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseOrderAgainOptions = Omit<
  UseQueryOptions<DeliveryOrderAgainItem[], ApiError>,
  'queryKey' | 'queryFn'
>;

// type UseShopTypeProductsOptions = Omit<
//   UseQueryOptions<DeliveryShopTypeProduct[], ApiError>,
//   'queryKey' | 'queryFn'
// >;
type UseShopTypeProductsMode = 'preview' | 'paginated';

type UseShopTypeProductsOptions = {
  mode?: UseShopTypeProductsMode;
  enabled?: boolean;
  search?: string;
  filters?: GenericListFilters;
  requestParams?: Omit<
    DeliveryShopTypeProductsParams,
    'shopTypeId' | 'offset' | 'limit' | 'search'
  >;
};

type ShopTypeProductsSectionResult = UseQueryResult<
  DeliveryShopTypeProduct[],
  ApiError
> & {
  shopType: DeliveryShopType;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeCategoryIds(categorySelections?: string[]) {
  if (!categorySelections?.length) {
    return undefined;
  }

  const validCategoryIds = categorySelections
    .map((categorySelection) => categorySelection.trim())
    .filter(Boolean)
    .filter((categoryId) => UUID_PATTERN.test(categoryId));

  return validCategoryIds.length > 0 ? Array.from(new Set(validCategoryIds)) : undefined;
}

function normalizeStockValue(stockId?: string | null) {
  if (!stockId) {
    return undefined;
  }

  if (stockId === 'in_stock') {
    return 'instock';
  }

  if (stockId === 'out_of_stock') {
    return 'outofstock';
  }

  return stockId;
}

function useDiscoveryCoordinates() {
  const { latitude, longitude } = useAddress();

  return {
    latitude,
    longitude,
  };
}

export function useShopTypes(options?: UseShopTypesOptions) {
  return useQuery<DeliveryShopType[], ApiError>({
    queryKey: deliveryKeys.shopTypes(),
    queryFn: () => discoveryService.getShopTypes(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useShopTypeProducts(
  shopTypeId: string,
  options?: UseShopTypeProductsOptions,
) {
  const mode = options?.mode ?? 'preview';
  const limit = 10;
  const { latitude, longitude } = useDiscoveryCoordinates();
  const shopTypeProductParams: Omit<
    DeliveryShopTypeProductsParams,
    'shopTypeId' | 'offset' | 'limit' | 'search'
  > = {
    ...options?.requestParams,
    latitude: options?.requestParams?.latitude ?? latitude,
    longitude: options?.requestParams?.longitude ?? longitude,
    category_ids: normalizeCategoryIds(options?.filters?.category_ids),
    price_tiers: options?.filters?.price_tiers
      ? [options.filters.price_tiers]
      : undefined,
    stock: normalizeStockValue(options?.filters?.stock),
    sort_by: options?.filters?.sort_by ?? undefined,
  };

  const query = useInfiniteQuery<
    PaginatedDeliveryResponse<DeliveryShopTypeProduct>,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.shopTypeProducts(shopTypeId, 0, limit),
      {
        filters: options?.filters,
        mode,
        requestParams: shopTypeProductParams,
        search: options?.search?.trim() ?? '',
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      discoveryService.getShopTypeProductsPage({
        shopTypeId,
        offset: pageParam as number,
        limit,
        search: options?.search?.trim() || undefined,
        ...shopTypeProductParams,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: (options?.enabled ?? true) && Boolean(shopTypeId),
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: mode === 'preview' ? items.slice(0, limit) : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}

export function useShopTypeProductsSections(
  shopTypes: DeliveryShopType[],
): ShopTypeProductsSectionResult[] {
  const featuredShopTypes = shopTypes.slice(0, 5);
  const { latitude, longitude } = useDiscoveryCoordinates();
  const results = useQueries({
    queries: featuredShopTypes.map((shopType) => ({
      queryKey: [
        ...deliveryKeys.shopTypeProducts(shopType.id, 0, 10),
        { latitude, longitude },
      ],
      queryFn: () =>
        discoveryService.getShopTypeProducts({
          shopTypeId: shopType.id,
          limit: 10,
          latitude,
          longitude,
        }),
      staleTime: 5 * 60 * 1000,
      enabled: Boolean(shopType.id),
    })),
  }) as UseQueryResult<DeliveryShopTypeProduct[], ApiError>[];

  return featuredShopTypes.map((shopType, index) => ({
    shopType,
    ...results[index],
  }));
}

export function useMobileBanners(options?: UseMobileBannersOptions) {
  return useQuery<DeliveryBanner[], ApiError>({
    queryKey: deliveryKeys.mobileBanners(),
    queryFn: () => discoveryService.getMobileBanners(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useTopBrands(options?: UseTopBrandsOptions) {
  return useQuery<DeliveryTopBrand[], ApiError>({
    queryKey: deliveryKeys.topBrands(),
    queryFn: () => discoveryService.getTopBrands(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useNearbyStores(options?: UseNearbyStoresOptions) {
  const mode = options?.mode ?? 'preview';
  const limit = 10;
  const { latitude, longitude } = useDiscoveryCoordinates();
  const nearbyStoreParams: Omit<
    DeliveryNearbyStoresParams,
    'offset' | 'limit' | 'search'
  > = {
    ...options?.requestParams,
    latitude: options?.requestParams?.latitude ?? latitude,
    longitude: options?.requestParams?.longitude ?? longitude,
    category_ids: normalizeCategoryIds(options?.filters?.category_ids),
    price_tiers: options?.filters?.price_tiers
      ? [options.filters.price_tiers]
      : undefined,
    stock: normalizeStockValue(options?.filters?.stock),
    sort_by: options?.filters?.sort_by ?? undefined,
  };

  const query = useInfiniteQuery<
    PaginatedDeliveryResponse<DeliveryNearbyStore>,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.nearbyStores(),
      {
        filters: options?.filters,
        mode,
        limit,
        requestParams: nearbyStoreParams,
        search: options?.search?.trim() ?? '',
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      discoveryService.getNearbyStoresPage({
        offset: pageParam as number,
        limit,
        search: options?.search?.trim() || undefined,
        ...nearbyStoreParams,
      } satisfies DeliveryNearbyStoresParams),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });

  const items =
    query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: mode === 'preview' ? items.slice(0, limit) : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}

export function useStoreView(
  storeId: string,
  options?: UseStoreViewOptions,
) {
  return useQuery<DeliveryStoreViewApiResponse, ApiError>({
    queryKey: deliveryKeys.storeView(storeId),
    queryFn: () => discoveryService.getStoreView(storeId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId),
    ...options,
  });
}

export function useStoreProducts(
  storeId: string,
  params: UseStoreProductsParams = {},
  options?: UseStoreProductsOptions,
) {
  const {
    limit,
    search,
    selectedCategoryId,
    selectedSubcategoryId,
  } = params;

  return useInfiniteQuery<
    DeliveryStoreProductsApiResponse,
    ApiError,
    InfiniteData<DeliveryStoreProductsApiResponse>,
    ReturnType<typeof deliveryKeys.storeProducts>,
    number
  >({
    queryKey: deliveryKeys.storeProducts(storeId, {
      limit,
      search,
      selectedCategoryId,
      selectedSubcategoryId,
    }),
    queryFn: ({ pageParam }) =>
      discoveryService.getStoreProducts(storeId, {
        offset: pageParam,
        limit,
        search,
        selectedCategoryId,
        selectedSubcategoryId,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: Boolean(storeId),
    ...options,
  });
}

export function useDeals(options?: UseDealsOptions) {
  return useQuery<DeliveryNearbyStore[], ApiError>({
    queryKey: deliveryKeys.deals(),
    queryFn: () => discoveryService.getDeals(),
    // staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useOrderAgain(options?: UseOrderAgainOptions) {
  return useQuery<DeliveryOrderAgainItem[], ApiError>({
    queryKey: deliveryKeys.orderAgain(),
    queryFn: () => discoveryService.getOrderAgain(),
    ...options,
  });
}
