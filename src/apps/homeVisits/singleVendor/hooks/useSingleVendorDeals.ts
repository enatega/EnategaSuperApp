import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorDealsApiResponse,
} from '../api/types';

const DEALS_LIMIT = 10;

export default function useSingleVendorDeals() {
  const query = useInfiniteQuery<HomeVisitsSingleVendorDealsApiResponse, ApiError>({
    queryKey: [...homeVisitsKeys.singleVendorDeals({ limit: DEALS_LIMIT, tab: 'all' })],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getDealsPage({
        offset: pageParam as number,
        limit: DEALS_LIMIT,
        tab: 'all',
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: items };
}
