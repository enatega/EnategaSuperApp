import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorFavoriteServicesApiResponse } from '../api/types';

const SINGLE_VENDOR_FAVORITE_SERVICES_LIMIT = 10;

export default function useSingleVendorFavoriteServices() {
  const query = useInfiniteQuery<
    HomeVisitsSingleVendorFavoriteServicesApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.singleVendorFavoriteServices({
      limit: SINGLE_VENDOR_FAVORITE_SERVICES_LIMIT,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getFavoriteServicesPage({
        offset: pageParam as number,
        limit: SINGLE_VENDOR_FAVORITE_SERVICES_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 60 * 1000,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: items,
  };
}
