import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import type { HomeVisitsMultiVendorNearbyServicesParams } from '../../multiVendor/api/types';
import { homeVisitsChainMenuTemplateService } from '../api/menuTemplateService';
import type { ChainMenuCategoryServicesApiResponse } from '../api/types';
import { useChainMenuStore } from '../stores/useChainMenuStore';

type UseChainCategoryServicesMode = 'preview' | 'paginated';
type ChainCategoryServicesFilters = Omit<
  HomeVisitsMultiVendorNearbyServicesParams,
  'offset' | 'limit'
>;

const CHAIN_CATEGORY_SERVICES_LIMIT = 10;

export default function useChainCategoryServices(
  categoryId: string,
  filters: ChainCategoryServicesFilters = {},
  options: { enabled?: boolean; mode?: UseChainCategoryServicesMode } = {},
) {
  const mode = options.mode ?? 'preview';
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );

  const query = useInfiniteQuery<ChainMenuCategoryServicesApiResponse, ApiError>({
    queryKey: [
      ...homeVisitsKeys.chainMenuCategoryServices(
        selectedMenuTemplateId ?? 'unknown',
        categoryId,
        {
          limit: CHAIN_CATEGORY_SERVICES_LIMIT,
          ...filters,
        },
      ),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsChainMenuTemplateService.getMenuCategoryServicesPage({
        menuTemplateId: selectedMenuTemplateId as string,
        categoryId,
        offset: pageParam as number,
        limit: CHAIN_CATEGORY_SERVICES_LIMIT,
        ...filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled:
      (options.enabled ?? true) &&
      Boolean(selectedMenuTemplateId) &&
      Boolean(categoryId),
  });

  const services = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data:
      mode === 'preview'
        ? services.slice(0, CHAIN_CATEGORY_SERVICES_LIMIT)
        : services,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
