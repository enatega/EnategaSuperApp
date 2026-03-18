import {
  useQueries,
  useInfiniteQuery,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { discoveryService } from '../api/discoveryService';
import { deliveryKeys } from '../api/queryKeys';
import type { GenericListFilters } from '../components/filters/types';
import type {
  DeliveryBanner,
  DeliveryNearbyStore,
  DeliveryOrderAgainItem,
  DeliveryNearbyStoresParams,
  PaginatedDeliveryResponse,
  DeliveryShopTypeProduct,
  DeliveryShopType,
  DeliveryTopBrand,
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
};

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
};

type ShopTypeProductsSectionResult = UseQueryResult<
  DeliveryShopTypeProduct[],
  ApiError
> & {
  shopType: DeliveryShopType;
};

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

  const query = useInfiniteQuery<
    PaginatedDeliveryResponse<DeliveryShopTypeProduct>,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.shopTypeProducts(shopTypeId, 0, limit),
      {
        mode,
        search: options?.search?.trim() ?? '',
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      discoveryService.getShopTypeProductsPage({
        shopTypeId,
        offset: pageParam as number,
        limit,
        search: options?.search?.trim() || undefined,
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
  const results = useQueries({
    queries: featuredShopTypes.map((shopType) => ({
      queryKey: deliveryKeys.shopTypeProducts(shopType.id, 0, 10),
      queryFn: () =>
        discoveryService.getShopTypeProducts({
          shopTypeId: shopType.id,
          limit: 10,
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
        search: options?.search?.trim() ?? '',
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      discoveryService.getNearbyStoresPage({
        offset: pageParam as number,
        limit,
        search: options?.search?.trim() || undefined,
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
