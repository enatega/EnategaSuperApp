import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorServiceCenterListItem,
  HomeVisitsSingleVendorServiceCenterServicesApiResponse,
} from '../api/types';

type Options = {
  enabled?: boolean;
  limit?: number;
};

const DEFAULT_LIMIT = 10;

export default function useServiceCenterServices(
  serviceCenterId: string,
  options: Options = {},
) {
  const resolvedServiceCenterId = serviceCenterId.trim();
  const resolvedLimit = options.limit ?? DEFAULT_LIMIT;

  const query = useInfiniteQuery<HomeVisitsSingleVendorServiceCenterServicesApiResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorServiceCenterServices(resolvedServiceCenterId, {
      limit: resolvedLimit,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getServiceCenterServicesPage({
        serviceCenterId: resolvedServiceCenterId,
        offset: pageParam as number,
        limit: resolvedLimit,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: Boolean(resolvedServiceCenterId) && (options.enabled ?? true),
    staleTime: 5 * 60 * 1000,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: items as HomeVisitsSingleVendorServiceCenterListItem[],
  };
}
