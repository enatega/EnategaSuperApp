import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsMultiVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsMultiVendorMainServicesApiResponse } from '../api/types';

type Options = {
  enabled?: boolean;
  mode?: 'preview' | 'paginated';
  search?: string;
};

const MAIN_SERVICES_LIMIT = 10;

export default function useMultiVendorMainServices(options: Options = {}) {
  const { enabled = true, mode = 'preview' } = options;
  const search = options.search?.trim() || undefined;
  const query = useInfiniteQuery<
    HomeVisitsMultiVendorMainServicesApiResponse,
    ApiError
  >({
    queryKey: [
      ...homeVisitsKeys.multiVendorMainServices({
        limit: MAIN_SERVICES_LIMIT,
        search,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsMultiVendorDiscoveryService.getMainServicesPage({
        offset: pageParam as number,
        limit: MAIN_SERVICES_LIMIT,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: mode === 'preview' ? items.slice(0, MAIN_SERVICES_LIMIT) : items,
  };
}
