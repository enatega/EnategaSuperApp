import {
  useInfiniteQuery,
  useQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import useAddress from '../../../general/hooks/useAddress';
import { appointmentsDiscoveryService } from '../api/discoveryService';
import { appointmentKeys } from '../api/queryKeys';
import type {
  AppointmentBanner,
  AppointmentCategory,
  AppointmentNearbyProvidersParams,
  AppointmentOrderAgainItem,
  AppointmentOrderAgainParams,
  AppointmentProvider,
  AppointmentSearchSuggestion,
  AppointmentShopType,
  AppointmentShopTypeCategoriesParams,
  AppointmentStoreService,
  AppointmentStoreServicesApiResponse,
  AppointmentStoreServicesParams,
  AppointmentStoreView,
  AppointmentTopBrand,
  AppointmentTopBrandsParams,
} from '../api/types';

type QueryOptions<T> = Omit<
  UseQueryOptions<T, ApiError>,
  'queryKey' | 'queryFn'
>;

type InfiniteQueryOptions<TData> = Omit<
  UseInfiniteQueryOptions<
    TData,
    ApiError,
    InfiniteData<TData>,
    ReturnType<typeof appointmentKeys.storeServices>,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

function useDiscoveryCoordinates() {
  const { latitude, longitude } = useAddress();

  return {
    latitude,
    longitude,
  };
}

export function useAppointmentBanners(
  params: { limit?: number; offset?: number } = {},
  options?: QueryOptions<AppointmentBanner[]>,
) {
  return useQuery<AppointmentBanner[], ApiError>({
    queryKey: appointmentKeys.banners({
      limit: params.limit ?? 10,
      offset: params.offset ?? 0,
    }),
    queryFn: () =>
      appointmentsDiscoveryService.getBanners({
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
      }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentShopTypes(
  params: { limit?: number; search?: string } = {},
  options?: QueryOptions<AppointmentShopType[]>,
) {
  return useQuery<AppointmentShopType[], ApiError>({
    queryKey: appointmentKeys.shopTypes({
      limit: params.limit ?? 10,
      search: params.search,
    }),
    queryFn: () =>
      appointmentsDiscoveryService.getShopTypes({
        limit: params.limit ?? 10,
        search: params.search,
      }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentSearchSuggestions(
  params: { limit?: number; search?: string } = {},
  options?: QueryOptions<AppointmentSearchSuggestion[]>,
) {
  return useQuery<AppointmentSearchSuggestion[], ApiError>({
    queryKey: appointmentKeys.searchSuggestions({
      limit: params.limit ?? 20,
      search: params.search,
    }),
    queryFn: () =>
      appointmentsDiscoveryService.getSearchSuggestions({
        limit: params.limit ?? 20,
        search: params.search,
      }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentShopTypeCategories(
  params: AppointmentShopTypeCategoriesParams,
  options?: QueryOptions<AppointmentCategory[]>,
) {
  return useQuery<AppointmentCategory[], ApiError>({
    queryKey: appointmentKeys.categories({
      shopTypeId: params.shopTypeId,
      limit: params.limit,
      search: params.search,
    }),
    queryFn: () => appointmentsDiscoveryService.getShopTypeCategories(params),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(params.shopTypeId) && (options?.enabled ?? true),
    ...options,
  });
}

export function useAppointmentBrands(
  params: { limit?: number; search?: string; latitude?: number; longitude?: number } = {},
  options?: QueryOptions<AppointmentProvider[]>,
) {
  const { latitude, longitude } = useDiscoveryCoordinates();
  const resolvedParams = {
    ...params,
    latitude: params.latitude ?? latitude,
    longitude: params.longitude ?? longitude,
  };

  return useQuery<AppointmentProvider[], ApiError>({
    queryKey: appointmentKeys.brands({
      limit: resolvedParams.limit,
      search: resolvedParams.search,
      latitude: resolvedParams.latitude,
      longitude: resolvedParams.longitude,
    }),
    queryFn: () => appointmentsDiscoveryService.getBrands(resolvedParams),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentTopBrands(
  params: AppointmentTopBrandsParams = {},
  options?: QueryOptions<AppointmentTopBrand[]>,
) {
  return useQuery<AppointmentTopBrand[], ApiError>({
    queryKey: appointmentKeys.topBrands({
      limit: params.limit,
      search: params.search,
    }),
    queryFn: () => appointmentsDiscoveryService.getTopBrands(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentNearbyProviders(
  params: AppointmentNearbyProvidersParams = {},
  options?: QueryOptions<AppointmentProvider[]>,
) {
  const { latitude, longitude } = useDiscoveryCoordinates();
  const resolvedParams = {
    ...params,
    latitude: params.latitude ?? latitude,
    longitude: params.longitude ?? longitude,
  };

  return useQuery<AppointmentProvider[], ApiError>({
    queryKey: appointmentKeys.nearbyProviders({
      limit: resolvedParams.limit,
      search: resolvedParams.search,
      category_id: resolvedParams.category_id,
      category_ids: resolvedParams.category_ids,
      shop_type_id: resolvedParams.shop_type_id,
      subcategory_id: resolvedParams.subcategory_id,
      stock: resolvedParams.stock,
      price_tiers: resolvedParams.price_tiers,
      sort_by: resolvedParams.sort_by,
      latitude: resolvedParams.latitude,
      longitude: resolvedParams.longitude,
    }),
    queryFn: () => appointmentsDiscoveryService.getNearbyProviders(resolvedParams),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentOrderAgain(
  params: AppointmentOrderAgainParams = {},
  options?: QueryOptions<AppointmentOrderAgainItem[]>,
) {
  return useQuery<AppointmentOrderAgainItem[], ApiError>({
    queryKey: appointmentKeys.orderAgain({
      limit: params.limit,
      search: params.search,
      category_id: params.category_id,
      category_ids: params.category_ids,
      shop_type_id: params.shop_type_id,
      subcategory_id: params.subcategory_id,
    }),
    queryFn: () => appointmentsDiscoveryService.getOrderAgain(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useAppointmentStoreView(
  storeId: string,
  options?: QueryOptions<AppointmentStoreView>,
) {
  return useQuery<AppointmentStoreView, ApiError>({
    queryKey: appointmentKeys.storeView(storeId),
    queryFn: () => appointmentsDiscoveryService.getStoreView(storeId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(storeId) && (options?.enabled ?? true),
    ...options,
  });
}

export function useAppointmentStoreServices(
  params: AppointmentStoreServicesParams,
  options?: InfiniteQueryOptions<AppointmentStoreServicesApiResponse>,
) {
  const { storeId, limit, search, categoryId, subcategoryId } = params;

  return useInfiniteQuery<
    AppointmentStoreServicesApiResponse,
    ApiError,
    InfiniteData<AppointmentStoreServicesApiResponse>,
    ReturnType<typeof appointmentKeys.storeServices>,
    number
  >({
    queryKey: appointmentKeys.storeServices(storeId, {
      limit,
      search,
      categoryId,
      subcategoryId,
    }),
    queryFn: ({ pageParam }) =>
      appointmentsDiscoveryService.getStoreServicesPage({
        storeId,
        offset: pageParam,
        limit,
        search,
        categoryId,
        subcategoryId,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(storeId) && (options?.enabled ?? true),
    ...options,
  });
}

export function useFlattenedAppointmentStoreServices(
  params: AppointmentStoreServicesParams,
  options?: InfiniteQueryOptions<AppointmentStoreServicesApiResponse>,
) {
  const query = useAppointmentStoreServices(params, options);

  return {
    ...query,
    data:
      query.data?.pages.flatMap(
        (page) => page.items,
      ) as AppointmentStoreService[] | undefined,
  };
}
