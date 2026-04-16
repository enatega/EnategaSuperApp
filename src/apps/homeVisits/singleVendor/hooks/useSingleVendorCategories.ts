import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorCategoriesApiResponse } from '../api/types';

type UseSingleVendorCategoriesMode = 'preview' | 'paginated';

type UseSingleVendorCategoriesOptions = {
  mode?: UseSingleVendorCategoriesMode;
  enabled?: boolean;
};

const SINGLE_VENDOR_CATEGORIES_LIMIT = 10;

export default function useSingleVendorCategories(
  options?: UseSingleVendorCategoriesOptions,
) {
  const mode = options?.mode ?? 'preview';
  const query = useInfiniteQuery<
    HomeVisitsSingleVendorCategoriesApiResponse,
    ApiError
  >({
    queryKey: [
      ...homeVisitsKeys.singleVendorCategories({
        limit: SINGLE_VENDOR_CATEGORIES_LIMIT,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getCategoriesPage({
        offset: pageParam as number,
        limit: SINGLE_VENDOR_CATEGORIES_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data:
      mode === 'preview'
        ? items.slice(0, SINGLE_VENDOR_CATEGORIES_LIMIT)
        : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
