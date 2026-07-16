import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsMultiVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsMultiVendorMainServiceCategoriesApiResponse } from '../api/types';

type Options = {
  enabled?: boolean;
  mode?: 'preview' | 'paginated';
  search?: string;
};

const MAIN_SERVICE_CATEGORIES_LIMIT = 10;

export default function useMultiVendorMainServiceCategories(
  mainServiceId?: string | null,
  options: Options = {},
) {
  const { enabled = true, mode = 'preview' } = options;
  const search = options.search?.trim() || undefined;
  const query = useInfiniteQuery<
    HomeVisitsMultiVendorMainServiceCategoriesApiResponse,
    ApiError
  >({
    queryKey: [
      ...homeVisitsKeys.multiVendorMainServiceCategories(
        mainServiceId ?? 'unknown',
        {
          limit: MAIN_SERVICE_CATEGORIES_LIMIT,
          search,
        },
      ),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsMultiVendorDiscoveryService.getMainServiceCategoriesPage({
        mainServiceId: mainServiceId as string,
        offset: pageParam as number,
        limit: MAIN_SERVICE_CATEGORIES_LIMIT,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && Boolean(mainServiceId),
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data:
      mode === 'preview'
        ? items.slice(0, MAIN_SERVICE_CATEGORIES_LIMIT)
        : items,
  };
}
