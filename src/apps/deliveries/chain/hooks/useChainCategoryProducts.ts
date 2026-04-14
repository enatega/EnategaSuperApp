import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type { GenericListFilters } from '../../components/filters/types';
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
  filters?: GenericListFilters;
  search?: string;
};

const CHAIN_CATEGORY_PRODUCTS_LIMIT = 10;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeSubcategoryId(categorySelections?: string[]) {
  if (!categorySelections?.length) {
    return undefined;
  }

  return categorySelections
    .map((categorySelection) => categorySelection.trim())
    .filter(Boolean)
    .find((categoryId) => UUID_PATTERN.test(categoryId));
}

function normalizeStockValue(stockId?: string | null) {
  if (!stockId) {
    return undefined;
  }

  if (stockId === 'in_stock') {
    return 'instock';
  }

  if (stockId === 'out_of_stock') {
    return 'outofstock';
  }

  return stockId;
}

export default function useChainCategoryProducts(
  categoryId: string,
  options?: UseChainCategoryProductsOptions,
) {
  const mode = options?.mode ?? 'preview';
  const normalizedSearch = options?.search?.trim() ?? '';
  const selectedMenuTemplateId = useChainMenuStore(
    (state) => state.selectedMenuTemplateId,
  );
  const requestParams = {
    stock: normalizeStockValue(options?.filters?.stock),
    subcategory_id: normalizeSubcategoryId(options?.filters?.category_ids),
    price_tiers: options?.filters?.price_tiers
      ? [options.filters.price_tiers]
      : undefined,
    sort_by: options?.filters?.sort_by ?? undefined,
  };

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
        filters: options?.filters,
        mode,
        requestParams,
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
        ...requestParams,
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
