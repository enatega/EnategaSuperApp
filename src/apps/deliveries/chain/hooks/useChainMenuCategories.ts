import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import type { DeliveryDiscoveryCategoryItem } from '../../components/discovery';
import { deliveryKeys } from '../../api/queryKeys';
import { chainMenuTemplateService } from '../api/menuTemplateService';
import type {
  ChainMenuCategory,
  ChainMenuCategoriesApiResponse,
} from '../api/types';

type UseChainMenuCategoriesMode = 'preview' | 'paginated';

const CHAIN_MENU_CATEGORIES_LIMIT = 10;

function mapChainMenuCategories(
  items: ChainMenuCategory[],
): DeliveryDiscoveryCategoryItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl ?? null,
  }));
}

type UseChainMenuCategoriesOptions = {
  enabled?: boolean;
  menuTemplateId?: string | null;
  mode?: UseChainMenuCategoriesMode;
};

export default function useChainMenuCategories(
  options?: UseChainMenuCategoriesOptions,
) {
  const mode = options?.mode ?? 'preview';
  const menuTemplateId = options?.menuTemplateId ?? null;

  const query = useInfiniteQuery<ChainMenuCategoriesApiResponse, ApiError>({
    queryKey: [
      ...deliveryKeys.chainMenuCategories(menuTemplateId ?? 'unknown', {
        limit: CHAIN_MENU_CATEGORIES_LIMIT,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      chainMenuTemplateService.getMenuCategoriesPage({
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

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const categories = mapChainMenuCategories(items);

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
