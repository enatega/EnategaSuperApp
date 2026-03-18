import {
  useQueries,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { discoveryService } from '../api/discoveryService';
import { deliveryKeys } from '../api/queryKeys';
import type {
  DeliveryBanner,
  DeliveryNearbyStore,
  DeliveryOrderAgainItem,
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

type UseNearbyStoresOptions = Omit<
  UseQueryOptions<DeliveryNearbyStore[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseDealsOptions = Omit<
  UseQueryOptions<DeliveryNearbyStore[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseOrderAgainOptions = Omit<
  UseQueryOptions<DeliveryOrderAgainItem[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseShopTypeProductsOptions = Omit<
  UseQueryOptions<DeliveryShopTypeProduct[], ApiError>,
  'queryKey' | 'queryFn'
>;

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
  return useQuery<DeliveryShopTypeProduct[], ApiError>({
    queryKey: deliveryKeys.shopTypeProducts(shopTypeId),
    queryFn: () =>
      discoveryService.getShopTypeProducts({
        shopTypeId,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(shopTypeId),
    ...options,
  });
}

export function useShopTypeProductsSections(
  shopTypes: DeliveryShopType[],
): ShopTypeProductsSectionResult[] {
  const featuredShopTypes = shopTypes.slice(0, 5);
  const results = useQueries({
    queries: featuredShopTypes.map((shopType) => ({
      queryKey: deliveryKeys.shopTypeProducts(shopType.id),
      queryFn: () =>
        discoveryService.getShopTypeProducts({
          shopTypeId: shopType.id,
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
  return useQuery<DeliveryNearbyStore[], ApiError>({
    queryKey: deliveryKeys.nearbyStores(),
    queryFn: () => discoveryService.getNearbyStores(),
    // staleTime: 5 * 60 * 1000,
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
