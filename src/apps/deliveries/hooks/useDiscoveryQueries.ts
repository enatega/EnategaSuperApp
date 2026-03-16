import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { discoveryService } from '../api/discoveryService';
import { deliveryKeys } from '../api/queryKeys';
import type {
  DeliveryBanner,
  DeliveryNearbyStore,
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

export function useShopTypes(options?: UseShopTypesOptions) {
  return useQuery<DeliveryShopType[], ApiError>({
    queryKey: deliveryKeys.shopTypes(),
    queryFn: () => discoveryService.getShopTypes(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
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
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
