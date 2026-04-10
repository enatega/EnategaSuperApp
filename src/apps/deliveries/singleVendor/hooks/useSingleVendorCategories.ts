import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { deliveryKeys } from '../../api/queryKeys';
import type { DeliveryDiscoveryCategoryItem } from '../../components/discovery';
import { singleVendorDiscoveryService } from '../api/discoveryService';
import type {
  SingleVendorCategoriesApiResponse,
  SingleVendorCategory,
} from '../api/types';

type UseSingleVendorCategoriesMode = 'preview' | 'paginated';

type UseSingleVendorCategoriesOptions = {
  mode?: UseSingleVendorCategoriesMode;
  enabled?: boolean;
};

const SINGLE_VENDOR_CATEGORIES_LIMIT = 10;

function mapSingleVendorCategories(
  items: SingleVendorCategory[],
): DeliveryDiscoveryCategoryItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    imageUrl: item.imageUrl ?? null,
  }));
}

export default function useSingleVendorCategories(
  options?: UseSingleVendorCategoriesOptions,
) {
  const mode = options?.mode ?? 'preview';
  const query = useInfiniteQuery<
    SingleVendorCategoriesApiResponse,
    ApiError
  >({
    queryKey: [
      ...deliveryKeys.singleVendorCategories({
        limit: SINGLE_VENDOR_CATEGORIES_LIMIT,
      }),
      { mode },
    ],
    queryFn: ({ pageParam = 0 }) =>
      singleVendorDiscoveryService.getCategoriesPage({
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
  const categories = mapSingleVendorCategories(items);

  return {
    ...query,
    data:
      mode === 'preview'
        ? categories.slice(0, SINGLE_VENDOR_CATEGORIES_LIMIT)
        : categories,
    totalCount: query.data?.pages.length
      ? query.data.pages[query.data.pages.length - 1]?.total
      : undefined,
  };
}
