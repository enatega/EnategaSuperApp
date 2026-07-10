import { useQuery } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../singleVendor/api/discoveryService';
import type { HomeVisitsSingleVendorBookingItem } from '../singleVendor/api/types';
import { isTerminalBookingStatus } from '../singleVendor/realtime/jobStatusSync';

const ACTIVE_BOOKING_QUERY_KEY = homeVisitsKeys.singleVendorBookings({
  limit: 1,
  tab: 'ongoing',
});

export default function useActiveBooking() {
  const query = useQuery<HomeVisitsSingleVendorBookingItem | null, ApiError>({
    queryKey: ACTIVE_BOOKING_QUERY_KEY,
    queryFn: async () => {
      const response =
        await homeVisitsSingleVendorDiscoveryService.getBookingsPage({
          offset: 0,
          limit: 1,
          tab: 'ongoing',
        });

      const booking = response.items[0] ?? null;
      if (!booking) {
        return null;
      }

      if (
        isTerminalBookingStatus(booking.jobStatus) ||
        isTerminalBookingStatus(booking.status) ||
        isTerminalBookingStatus(booking.paymentStatus)
      ) {
        return null;
      }

      return booking;
    },
    staleTime: 30 * 1000,
  });

  useFocusEffect(
    React.useCallback(() => {
      void query.refetch();
    }, [query.refetch]),
  );

  const activeBooking =
    query.data &&
    !isTerminalBookingStatus(query.data.jobStatus) &&
    !isTerminalBookingStatus(query.data.status) &&
    !isTerminalBookingStatus(query.data.paymentStatus)
      ? query.data
      : null;

  return {
    ...query,
    data: activeBooking,
  };
}
