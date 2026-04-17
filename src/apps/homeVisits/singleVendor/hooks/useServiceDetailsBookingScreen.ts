import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import type { HomeVisitsSingleVendorServiceBookingScreenResponse } from '../../types/serviceDetails';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';

export default function useServiceDetailsBookingScreen(serviceId: string) {
  return useQuery<HomeVisitsSingleVendorServiceBookingScreenResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorServiceBookingScreen(serviceId),
    queryFn: () => homeVisitsSingleVendorDiscoveryService.getServiceBookingScreen(serviceId),
    enabled: Boolean(serviceId),
    staleTime: 5 * 60 * 1000,
  });
}
