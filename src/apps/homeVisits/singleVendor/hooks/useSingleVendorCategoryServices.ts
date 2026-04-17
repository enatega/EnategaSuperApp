import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsSingleVendorCategoryServicesApiResponse,
  HomeVisitsSingleVendorCategoryServicesParams,
} from '../api/types';

type CategoryServicesServerFilters = Omit<
  HomeVisitsSingleVendorCategoryServicesParams,
  'offset' | 'limit' | 'categoryId'
>;
type Options = {
  enabled?: boolean;
};

const SINGLE_VENDOR_CATEGORY_SERVICES_LIMIT = 10;

export default function useSingleVendorCategoryServices(
  categoryId?: string,
  filters: CategoryServicesServerFilters = {},
  options: Options = {},
) {
  const resolvedCategoryId = categoryId?.trim() ?? '';
  const { enabled = true } = options;

  const query = useInfiniteQuery<HomeVisitsSingleVendorCategoryServicesApiResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorCategoryServices(resolvedCategoryId, {
      offset: 0,
      limit: SINGLE_VENDOR_CATEGORY_SERVICES_LIMIT,
      ...filters,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getCategoryServicesPage({
        categoryId: resolvedCategoryId,
        offset: pageParam as number,
        limit: SINGLE_VENDOR_CATEGORY_SERVICES_LIMIT,
        ...filters,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(resolvedCategoryId) && enabled,
  });

  const services = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: services };
}
