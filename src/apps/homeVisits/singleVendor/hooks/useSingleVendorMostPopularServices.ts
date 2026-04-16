import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorMostPopularServicesApiResponse } from '../api/types';

const SINGLE_VENDOR_MOST_POPULAR_SERVICES_LIMIT = 10;

export default function useSingleVendorMostPopularServices() {
  const query = useInfiniteQuery<
    HomeVisitsSingleVendorMostPopularServicesApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.singleVendorMostPopularServices({
      limit: SINGLE_VENDOR_MOST_POPULAR_SERVICES_LIMIT,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getMostPopularServicesPage({
        offset: pageParam as number,
        limit: SINGLE_VENDOR_MOST_POPULAR_SERVICES_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
  });

  const services = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: services };
}
