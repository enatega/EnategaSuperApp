import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { discoveryService } from '../api/discoveryService';
import { deliveryKeys } from '../api/queryKeys';
import type { DeliveryBanner, DeliveryShopType } from '../api/types';

type UseShopTypesOptions = Omit<
  UseQueryOptions<DeliveryShopType[], ApiError>,
  'queryKey' | 'queryFn'
>;

type UseMobileBannersOptions = Omit<
  UseQueryOptions<DeliveryBanner[], ApiError>,
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
