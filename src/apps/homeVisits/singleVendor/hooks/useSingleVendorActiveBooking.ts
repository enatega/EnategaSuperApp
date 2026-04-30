import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { ApiError } from '../../../../general/api/apiClient';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { homeVisitsKeys } from '../../api/queryKeys';
import {
  homeServicesSocketClient,
  subscribeHomeServicesEvent,
} from '../../socket/homeServicesSocket';
import type { JobStatusUpdatedEvent } from '../../socket/homeServicesSocket.types';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorBookingItem } from '../api/types';
import { resolveBookingStatusLabel } from '../utils/bookingStatusLabel';

const ACTIVE_BOOKING_QUERY_KEY = homeVisitsKeys.singleVendorBookings({
  limit: 1,
  tab: 'ongoing',
});

function isJobStatusUpdatedEvent(payload: unknown): payload is JobStatusUpdatedEvent {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const value = payload as Partial<JobStatusUpdatedEvent>;

  return typeof value.jobId === 'string' && typeof value.jobStatus === 'string';
}

export default function useSingleVendorActiveBooking() {
  const { t } = useTranslation('homeVisits');
  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  const userId = sessionQuery.data?.user?.id ?? null;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    void homeServicesSocketClient.updateSession({ token, userId });
  }, [token, userId]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    homeServicesSocketClient.retain();
    void homeServicesSocketClient.connect();

    const unsubscribe = subscribeHomeServicesEvent(
      'job-status-updated',
      (payload) => {
        if (!isJobStatusUpdatedEvent(payload)) {
          return;
        }

        queryClient.setQueryData<HomeVisitsSingleVendorBookingItem | null>(
          ACTIVE_BOOKING_QUERY_KEY,
          (cached) => {
            if (!cached || cached.orderId !== payload.jobId) {
              return cached;
            }

            return {
              ...cached,
              jobStatus: payload.jobStatus,
              status: payload.jobStatus,
              statusLabel: resolveBookingStatusLabel(
                payload.jobStatus,
                cached.statusLabel,
                t,
              ),
            };
          },
        );
      },
    );

    return () => {
      unsubscribe();
      homeServicesSocketClient.release();
    };
  }, [queryClient, t, token]);

  return useQuery<HomeVisitsSingleVendorBookingItem | null, ApiError>({
    queryKey: ACTIVE_BOOKING_QUERY_KEY,
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
