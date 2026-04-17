import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorBookingsApiResponse,
  HomeVisitsSingleVendorBookingsTab,
} from '../api/types';

const BOOKINGS_LIMIT = 10;

type Params = {
  tab: HomeVisitsSingleVendorBookingsTab;
};

export default function useSingleVendorBookings({ tab }: Params) {
  const query = useInfiniteQuery<HomeVisitsSingleVendorBookingsApiResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorBookings({ limit: BOOKINGS_LIMIT, tab }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getBookingsPage({
        offset: pageParam as number,
        limit: BOOKINGS_LIMIT,
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
