import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { appointmentBookingsService } from '../api/bookingsService';
import { appointmentKeys } from '../api/queryKeys';

const PAST_BOOKINGS_LIMIT = 10;

export function useScheduledAppointmentBookings() {
  return useQuery({
    queryKey: appointmentKeys.scheduledBookings(),
    queryFn: () => appointmentBookingsService.getScheduledBookings(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useScheduledAppointmentBookingDetail(orderId: string) {
  return useQuery({
    queryKey: appointmentKeys.scheduledBookingDetail(orderId),
    queryFn: () => appointmentBookingsService.getScheduledBookingDetail(orderId),
    enabled: Boolean(orderId),
    staleTime: 60 * 1000,
  });
}

export function usePastAppointmentBookings(limit = PAST_BOOKINGS_LIMIT) {
  return useInfiniteQuery({
    queryKey: appointmentKeys.pastBookings({ limit }),
    queryFn: ({ pageParam = 0 }) =>
      appointmentBookingsService.getPastBookings({
        offset: pageParam as number,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });
}

export type AppointmentBookingsError = ApiError;
