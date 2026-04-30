import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorBannersApiResponse } from '../api/types';

const SINGLE_VENDOR_BANNERS_LIMIT = 10;

export default function useSingleVendorBanners() {
  const query = useInfiniteQuery<
    HomeVisitsSingleVendorBannersApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.singleVendorBanners({
      limit: SINGLE_VENDOR_BANNERS_LIMIT,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getBannersPage({
        offset: pageParam as number,
        limit: SINGLE_VENDOR_BANNERS_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
  });

  const banners = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: banners };
}
