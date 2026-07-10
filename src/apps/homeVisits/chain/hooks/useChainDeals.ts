import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import type {
  HomeVisitsMultiVendorDeal,
  HomeVisitsMultiVendorDealsParams,
} from '../../multiVendor/api/types';
import { homeVisitsChainMenuTemplateService } from '../api/menuTemplateService';
import type { ChainMenuDealsApiResponse } from '../api/types';
import { useChainMenuStore } from '../stores/useChainMenuStore';

type UseChainDealsMode = 'preview' | 'paginated';
type ChainDealsFilters = Omit<HomeVisitsMultiVendorDealsParams, 'offset' | 'limit'>;

const CHAIN_DEALS_LIMIT = 10;

export default function useChainDeals(
  filters: ChainDealsFilters = {},
  options: { enabled?: boolean; mode?: UseChainDealsMode; tab?: string } = {},
) {
  const mode = options.mode ?? 'preview';
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );

  const query = useInfiniteQuery<ChainMenuDealsApiResponse, ApiError>({
    queryKey: [
      ...homeVisitsKeys.chainMenuDeals(selectedMenuTemplateId ?? 'unknown', {
        limit: CHAIN_DEALS_LIMIT,
        ...filters,
        tab: options.tab,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsChainMenuTemplateService.getDealsPage({
        menuTemplateId: selectedMenuTemplateId as string,
        offset: pageParam as number,
        limit: CHAIN_DEALS_LIMIT,
        ...filters,
        tab: options.tab,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(selectedMenuTemplateId) && (options.enabled ?? true),
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: (mode === 'preview'
      ? items.slice(0, CHAIN_DEALS_LIMIT)
      : items) as HomeVisitsMultiVendorDeal[],
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
