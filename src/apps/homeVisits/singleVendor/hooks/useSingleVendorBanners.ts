import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import type { DeliveryBanner } from '../../../deliveries/api/types';
import { singleVendorDiscoveryService } from '../api/discoveryService';

type UseSingleVendorBannersOptions = Omit<
  UseQueryOptions<DeliveryBanner[], ApiError>,
  'queryKey' | 'queryFn'
>;

const SINGLE_VENDOR_BANNERS_LIMIT = 10;

export default function useSingleVendorBanners(
  options?: UseSingleVendorBannersOptions,
) {
  return useQuery<DeliveryBanner[], ApiError>({
    queryKey: ['homeVisits', 'single-vendor-banners', SINGLE_VENDOR_BANNERS_LIMIT],
    queryFn: () =>
      singleVendorDiscoveryService.getBanners({
        limit: SINGLE_VENDOR_BANNERS_LIMIT,
      }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
