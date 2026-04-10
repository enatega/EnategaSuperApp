import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type {
  DeliveryShopTypeProduct,
  PaginatedDeliveryResponse,
} from '../../api/types';
import { singleVendorDiscoveryService } from '../api/discoveryService';

type UseSingleVendorCategoryProductsMode = 'preview' | 'paginated';

type UseSingleVendorCategoryProductsOptions = {
  mode?: UseSingleVendorCategoryProductsMode;
  enabled?: boolean;
  search?: string;
};

const SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT = 10;

export default function useSingleVendorCategoryProducts(
  categoryId: string,
  options?: UseSingleVendorCategoryProductsOptions,
) {
  const mode = options?.mode ?? 'preview';
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
      { mode,
        search: options?.search?.trim() ?? ''
        
       },
    ],
    queryFn: ({ pageParam = 0 }) =>
      singleVendorDiscoveryService.getCategoryProductsPage({
        categoryId,
        offset: pageParam as number,
        limit: SINGLE_VENDOR_CATEGORY_PRODUCTS_LIMIT,
        search: options?.search?.trim() || undefined,
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
