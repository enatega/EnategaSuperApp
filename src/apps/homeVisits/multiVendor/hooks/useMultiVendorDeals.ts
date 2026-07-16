import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsMultiVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsMultiVendorDealsApiResponse,
  HomeVisitsMultiVendorDealsParams,
} from '../api/types';

type DealsFilters = Omit<HomeVisitsMultiVendorDealsParams, 'offset' | 'limit'>;
type Options = {
  enabled?: boolean;
};

const DEALS_LIMIT = 10;

export default function useMultiVendorDeals(
  filters: DealsFilters = {},
  options: Options = {},
) {
  const { enabled = true } = options;
  const query = useInfiniteQuery<HomeVisitsMultiVendorDealsApiResponse, ApiError>({
    queryKey: homeVisitsKeys.multiVendorDeals({
      limit: DEALS_LIMIT,
      ...filters,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsMultiVendorDiscoveryService.getDealsPage({
        offset: pageParam as number,
        limit: DEALS_LIMIT,
        ...filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  const deals = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: deals };
}
