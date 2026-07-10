import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsChainMenuTemplateService } from '../api/menuTemplateService';
import type { ChainMenuCategoriesApiResponse } from '../api/types';

type UseChainMenuCategoriesMode = 'preview' | 'paginated';

const CHAIN_MENU_CATEGORIES_LIMIT = 10;

export default function useChainMenuCategories(options?: {
  enabled?: boolean;
  menuTemplateId?: string | null;
  mode?: UseChainMenuCategoriesMode;
}) {
  const mode = options?.mode ?? 'preview';
  const menuTemplateId = options?.menuTemplateId ?? null;

  const query = useInfiniteQuery<ChainMenuCategoriesApiResponse, ApiError>({
    queryKey: [
      ...homeVisitsKeys.chainMenuCategories(menuTemplateId ?? 'unknown', {
        limit: CHAIN_MENU_CATEGORIES_LIMIT,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsChainMenuTemplateService.getMenuCategoriesPage({
        menuTemplateId: menuTemplateId as string,
        offset: pageParam as number,
        limit: CHAIN_MENU_CATEGORIES_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(menuTemplateId) && (options?.enabled ?? true),
  });

  const categories = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data:
      mode === 'preview'
        ? categories.slice(0, CHAIN_MENU_CATEGORIES_LIMIT)
        : categories,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
