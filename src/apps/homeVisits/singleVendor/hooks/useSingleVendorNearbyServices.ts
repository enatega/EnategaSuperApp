import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorNearbyServicesApiResponse } from '../api/types';

type UseSingleVendorNearbyServicesParams = {
  latitude?: number;
  longitude?: number;
};

const SINGLE_VENDOR_NEARBY_SERVICES_LIMIT = 10;

export default function useSingleVendorNearbyServices(
  params: UseSingleVendorNearbyServicesParams,
) {
  const resolvedLatitude =
    typeof params.latitude === 'number' && Number.isFinite(params.latitude)
      ? params.latitude
      : undefined;
  const resolvedLongitude =
    typeof params.longitude === 'number' && Number.isFinite(params.longitude)
      ? params.longitude
      : undefined;
  const isEnabled = resolvedLatitude !== undefined && resolvedLongitude !== undefined;

  const query = useInfiniteQuery<
    HomeVisitsSingleVendorNearbyServicesApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.singleVendorNearbyServices({
      limit: SINGLE_VENDOR_NEARBY_SERVICES_LIMIT,
      latitude: resolvedLatitude,
      longitude: resolvedLongitude,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getNearbyServicesPage({
        offset: pageParam as number,
        limit: SINGLE_VENDOR_NEARBY_SERVICES_LIMIT,
        latitude: resolvedLatitude as number,
        longitude: resolvedLongitude as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 5 * 60 * 1000,
    enabled: isEnabled,
  });

  const services = query.data?.pages.flatMap((page) => page.items) ?? [];

  return { ...query, data: services, isEnabled };
}
