import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import type { DeliveryDealsTabType } from '../../api/dealsServiceTypes';
import { deliveryKeys } from '../../api/queryKeys';
import type {
  DeliveryShopTypeProduct,
  PaginatedDeliveryResponse,
} from '../../api/types';
import { chainMenuTemplateService } from '../api/menuTemplateService';
import { useChainMenuStore } from '../stores/useChainMenuStore';

type UseChainDealsMode = 'preview' | 'paginated';

type UseChainDealsOptions = {
  mode?: UseChainDealsMode;
  enabled?: boolean;
  search?: string;
  sortBy?: string;
  tab?: DeliveryDealsTabType;
};

const CHAIN_DEALS_LIMIT = 10;

export default function useChainDeals(options?: UseChainDealsOptions) {
  const mode = options?.mode ?? 'preview';
  const normalizedSearch = options?.search?.trim() ?? '';
  const tab = options?.tab ?? 'all';
  const sortBy = options?.sortBy?.trim() ?? '';
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );

  const query = useInfiniteQuery<
    PaginatedDeliveryResponse<DeliveryShopTypeProduct>,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.chainMenuDeals({
        menuTemplateId: selectedMenuTemplateId ?? 'unknown',
        limit: CHAIN_DEALS_LIMIT,
        search: normalizedSearch,
        tab,
        sort_by: sortBy,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      chainMenuTemplateService.getDealsPage({
        menuTemplateId: selectedMenuTemplateId as string,
        offset: pageParam as number,
        limit: CHAIN_DEALS_LIMIT,
        search: normalizedSearch || undefined,
        tab,
        sort_by: sortBy || undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(selectedMenuTemplateId) && (options?.enabled ?? true),
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: mode === 'preview' ? items.slice(0, CHAIN_DEALS_LIMIT) : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
