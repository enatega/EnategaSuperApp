import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorFavoriteServicesApiResponse } from '../api/types';

const SINGLE_VENDOR_FAVORITE_SERVICES_LIMIT = 10;

export default function useSingleVendorFavoriteServices() {
  const query = useQuery<HomeVisitsSingleVendorFavoriteServicesApiResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorFavoriteServices({
      offset: 0,
      limit: SINGLE_VENDOR_FAVORITE_SERVICES_LIMIT,
    }),
    queryFn: () =>
      homeVisitsSingleVendorDiscoveryService.getFavoriteServicesPage({
        offset: 0,
        limit: SINGLE_VENDOR_FAVORITE_SERVICES_LIMIT,
      }),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    data: query.data?.items ?? [],
  };
}
