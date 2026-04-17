import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorMostPopularServicesApiResponse,
  HomeVisitsSingleVendorMostPopularServicesParams,
} from '../api/types';

type MostPopularServerFilters = Omit<
  HomeVisitsSingleVendorMostPopularServicesParams,
  'offset' | 'limit'
>;
type Options = {
  enabled?: boolean;
};

const SINGLE_VENDOR_MOST_POPULAR_SERVICES_LIMIT = 10;

export default function useSingleVendorMostPopularServices(
  filters: MostPopularServerFilters = {},
  options: Options = {},
) {
  const { enabled = true } = options;
  const query = useInfiniteQuery<
    HomeVisitsSingleVendorMostPopularServicesApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.singleVendorMostPopularServices({
      limit: SINGLE_VENDOR_MOST_POPULAR_SERVICES_LIMIT,
      ...filters,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getMostPopularServicesPage({
        offset: pageParam as number,
        limit: SINGLE_VENDOR_MOST_POPULAR_SERVICES_LIMIT,
        ...filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  const services = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: services };
}
