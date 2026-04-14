import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type {
  DeliveryShopTypeProduct,
  PaginatedDeliveryResponse,
} from '../../api/types';
import { chainMenuTemplateService } from '../api/menuTemplateService';
import { useChainMenuStore } from '../stores/useChainMenuStore';

type UseChainCategoryProductsMode = 'preview' | 'paginated';

type UseChainCategoryProductsOptions = {
  mode?: UseChainCategoryProductsMode;
  enabled?: boolean;
  search?: string;
};

const CHAIN_CATEGORY_PRODUCTS_LIMIT = 10;

export default function useChainCategoryProducts(
  categoryId: string,
  options?: UseChainCategoryProductsOptions,
) {
  const mode = options?.mode ?? 'preview';
  const normalizedSearch = options?.search?.trim() ?? '';
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );

  const query = useInfiniteQuery<
    PaginatedDeliveryResponse<DeliveryShopTypeProduct>,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.chainMenuCategoryProducts(
        selectedMenuTemplateId ?? 'unknown',
        categoryId,
        0,
        CHAIN_CATEGORY_PRODUCTS_LIMIT,
      ),
      {
        mode,
        search: normalizedSearch,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      chainMenuTemplateService.getMenuCategoryProductsPage({
        menuTemplateId: selectedMenuTemplateId as string,
        categoryId,
        offset: pageParam as number,
        limit: CHAIN_CATEGORY_PRODUCTS_LIMIT,
        search: normalizedSearch || undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled:
      (options?.enabled ?? true) &&
      Boolean(selectedMenuTemplateId) &&
      Boolean(categoryId),
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data:
      mode === 'preview'
        ? items.slice(0, CHAIN_CATEGORY_PRODUCTS_LIMIT)
        : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
