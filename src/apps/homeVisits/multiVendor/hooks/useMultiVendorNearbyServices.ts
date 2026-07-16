import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsMultiVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsMultiVendorNearbyServicesApiResponse,
  HomeVisitsMultiVendorNearbyServicesParams,
} from '../api/types';

type NearbyFilters = Omit<HomeVisitsMultiVendorNearbyServicesParams, 'offset' | 'limit'>;
type Options = {
  enabled?: boolean;
};

const NEARBY_SERVICES_LIMIT = 10;

export default function useMultiVendorNearbyServices(
  filters: NearbyFilters = {},
  options: Options = {},
) {
  const { enabled = true } = options;
  const query = useInfiniteQuery<
    HomeVisitsMultiVendorNearbyServicesApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.multiVendorNearbyServices({
      limit: NEARBY_SERVICES_LIMIT,
      ...filters,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsMultiVendorDiscoveryService.getNearbyServicesPage({
        offset: pageParam as number,
        limit: NEARBY_SERVICES_LIMIT,
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
