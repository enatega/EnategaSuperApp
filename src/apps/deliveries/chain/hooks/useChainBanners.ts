import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type { DeliveryBanner } from '../../api/types';
import { chainDiscoveryService } from '../api/discoveryService';

type UseChainBannersOptions = Omit<
  UseQueryOptions<DeliveryBanner[], ApiError>,
  'queryKey' | 'queryFn'
>;

const CHAIN_BANNERS_LIMIT = 10;

export default function useChainBanners(options?: UseChainBannersOptions) {
  return useQuery<DeliveryBanner[], ApiError>({
    queryKey: deliveryKeys.chainBanners({ limit: CHAIN_BANNERS_LIMIT }),
    queryFn: () =>
      chainDiscoveryService.getBanners({
        limit: CHAIN_BANNERS_LIMIT,
      }),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
