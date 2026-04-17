import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';

type Params = {
  orderId: string;
};

export default function useSingleVendorBookingDetails({ orderId }: Params) {
  return useQuery<HomeVisitsSingleVendorBookingDetails, ApiError>({
    queryKey: homeVisitsKeys.singleVendorBookingDetail(orderId),
    queryFn: () => homeVisitsSingleVendorDiscoveryService.getBookingDetails(orderId),
    enabled: Boolean(orderId),
    staleTime: 30 * 1000,
  });
}
