import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type {
  DeliveryShopTypeProduct,
  PaginatedDeliveryResponse,
} from '../../api/types';
import type { GenericListFilters } from '../../components/filters/types';
import useAddress from '../../../../general/hooks/useAddress';
import { singleVendorDiscoveryService } from '../api/discoveryService';

type UseSingleVendorCategoryProductsMode = 'preview' | 'paginated';

type UseSingleVendorCategoryProductsOptions = {
  mode?: UseSingleVendorCategoryProductsMode;
  enabled?: boolean;
  filters?: GenericListFilters;
  search?: string;
};

const SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT = 10;
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

export default function useSingleVendorCategoryProducts(
  categoryId: string,
  options?: UseSingleVendorCategoryProductsOptions,
) {
  const mode = options?.mode ?? 'preview';
  const normalizedSearch = options?.search?.trim() ?? '';
  const { latitude, longitude } = useAddress();
  const requestParams = {
    latitude,
    longitude,
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
      ...deliveryKeys.singleVendorCategoryProducts(
        categoryId,
        0,
        SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT,
      ),
      {
        filters: options?.filters,
        mode,
        requestParams,
        search: normalizedSearch,
      },
    ],
    queryFn: ({ pageParam = 0 }) =>
      singleVendorDiscoveryService.getCategoryProductsPage({
        categoryId,
        offset: pageParam as number,
        limit: SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT,
        search: normalizedSearch || undefined,
        ...requestParams,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: (options?.enabled ?? true) && Boolean(categoryId),
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data:
      mode === 'preview'
        ? items.slice(0, SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT)
        : items,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
