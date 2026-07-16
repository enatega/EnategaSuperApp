import { useInfiniteQuery } from '@tanstack/react-query';
import { homeVisitsKeys } from '../../api/queryKeys';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorBookingsTab,
  HomeVisitsSingleVendorContractsApiResponse,
} from '../api/types';

const CONTRACTS_LIMIT = 10;

export default function useSingleVendorContracts(
  tab: HomeVisitsSingleVendorBookingsTab = 'ongoing',
) {
  const query = useInfiniteQuery<HomeVisitsSingleVendorContractsApiResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorContracts({ limit: CONTRACTS_LIMIT, tab }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getContractsPage({
        offset: pageParam as number,
        limit: CONTRACTS_LIMIT,
        tab,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 60 * 1000,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: items };
}
