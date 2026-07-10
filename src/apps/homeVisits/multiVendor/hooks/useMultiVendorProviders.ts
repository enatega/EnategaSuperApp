import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsMultiVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsMultiVendorProvidersApiResponse,
  HomeVisitsMultiVendorProvidersParams,
} from '../api/types';

type ProviderFilters = Omit<HomeVisitsMultiVendorProvidersParams, 'offset' | 'limit'>;
type Options = {
  enabled?: boolean;
  scope?: 'top-centers' | 'service-providers';
};

const PROVIDERS_LIMIT = 10;

export default function useMultiVendorProviders(
  filters: ProviderFilters = {},
  options: Options = {},
) {
  const { enabled = true, scope = 'top-centers' } = options;
  const query = useInfiniteQuery<
    HomeVisitsMultiVendorProvidersApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.multiVendorProviders({
      limit: PROVIDERS_LIMIT,
      scope,
      ...filters,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsMultiVendorDiscoveryService.getProvidersPage(
        {
          offset: pageParam as number,
          limit: PROVIDERS_LIMIT,
          ...filters,
        },
        scope,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  const providers = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: providers };
}
