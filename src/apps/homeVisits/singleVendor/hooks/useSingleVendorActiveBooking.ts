import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorBookingItem } from '../api/types';

export default function useSingleVendorActiveBooking() {
  return useQuery<HomeVisitsSingleVendorBookingItem | null, ApiError>({
    queryKey: homeVisitsKeys.singleVendorBookings({ limit: 1, tab: 'ongoing' }),
    queryFn: async () => {
      const response = await homeVisitsSingleVendorDiscoveryService.getBookingsPage({
        offset: 0,
        limit: 1,
        tab: 'ongoing',
      });

      return response.items[0] ?? null;
    },
    staleTime: 30 * 1000,
  });
}
