import type { QueryClient } from '@tanstack/react-query';
import React from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import type { LatLng } from 'react-native-maps';
import { homeVisitsKeys } from '../../api/queryKeys';
import {
  homeServicesSocketClient,
  subscribeHomeServicesEvent,
} from '../../socket/homeServicesSocket';
import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';
import {
  isJobStatusUpdatedEvent,
  isWorkerLocationEvent,
  readString,
} from '../utils/trackWorkerLocation';

type Params = {
  currentUserId: string | null;
  initialBookingData: HomeVisitsSingleVendorBookingDetails | undefined;
  onJobStatusUpdated: () => void;
  orderId: string;
  queryClient: QueryClient;
  token: string | null;
};

export default function useTrackWorkerRealtime({
  currentUserId,
  initialBookingData,
  onJobStatusUpdated,
  orderId,
  queryClient,
  token,
}: Params) {
  const [liveBookingData, setLiveBookingData] = React.useState<HomeVisitsSingleVendorBookingDetails | null>(null);
  const [workerLocation, setWorkerLocation] = React.useState<LatLng | null>(null);

  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);
  const currentOrderIdRef = React.useRef(orderId);
  const currentUserIdRef = React.useRef<string | null>(currentUserId);
  const initialBookingDataRef = React.useRef(initialBookingData);
  const onJobStatusUpdatedRef = React.useRef(onJobStatusUpdated);

  React.useEffect(() => {
    currentOrderIdRef.current = orderId;
  }, [orderId]);

  React.useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  React.useEffect(() => {
    initialBookingDataRef.current = initialBookingData;
  }, [initialBookingData]);

  React.useEffect(() => {
    onJobStatusUpdatedRef.current = onJobStatusUpdated;
  }, [onJobStatusUpdated]);

  React.useEffect(() => {
    if (initialBookingData) {
      setLiveBookingData(initialBookingData);
    }
  }, [initialBookingData]);

  React.useEffect(() => {
    void homeServicesSocketClient.updateSession({ token, userId: currentUserId });
  }, [currentUserId, token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    homeServicesSocketClient.retain();
    void homeServicesSocketClient.connect();

    return () => {
      homeServicesSocketClient.release();
    };
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (previousState === 'active' && nextState !== 'active') {
        homeServicesSocketClient.disconnectIfIdle();
        return;
      }

      if (nextState === 'active' && homeServicesSocketClient.hasActiveConsumers()) {
        void homeServicesSocketClient.connect();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    const unsubscribeStatus = subscribeHomeServicesEvent('job-status-updated', (payload) => {
      console.log('[home-services][track-worker] event received: job-status-updated', payload);

      if (!isJobStatusUpdatedEvent(payload)) {
        console.warn('[home-services][track-worker] ignored invalid job-status-updated payload', payload);
        return;
      }

      if (payload.jobId !== currentOrderIdRef.current) {
        console.log('[home-services][track-worker] ignored job-status-updated for different job', {
          activeOrderId: currentOrderIdRef.current,
          eventJobId: payload.jobId,
        });
        return;
      }

      onJobStatusUpdatedRef.current();
      setLiveBookingData((previous) => {
        const base = previous ?? initialBookingDataRef.current;

        if (!base) {
          return {
            orderId: payload.jobId,
            jobStatus: payload.jobStatus,
            status: payload.jobStatus,
            assignedWorker: payload.workerId ? { id: payload.workerId } : null,
          };
        }

        return {
          ...base,
          jobStatus: payload.jobStatus,
          status: payload.jobStatus,
          assignedWorker: {
            ...(base.assignedWorker ?? {}),
            id: payload.workerId ?? base.assignedWorker?.id,
          },
        };
      });

      console.log('[home-services][track-worker] applying job status update to local UI', {
        orderId: payload.jobId,
        previousJobStatus: payload.previousJobStatus,
        jobStatus: payload.jobStatus,
        workerId: payload.workerId,
        message: payload.message,
      });

      queryClient.setQueryData<HomeVisitsSingleVendorBookingDetails>(
        homeVisitsKeys.singleVendorBookingDetail(payload.jobId),
        (cached) => {
          if (!cached) {
            console.log('[home-services][track-worker] cache miss for booking detail', {
              orderId: payload.jobId,
            });
            return cached;
          }

          return {
            ...cached,
            jobStatus: payload.jobStatus,
            status: payload.jobStatus,
            assignedWorker: {
              ...(cached.assignedWorker ?? {}),
              id: payload.workerId ?? cached.assignedWorker?.id,
            },
          };
        },
      );
    });

    const unsubscribeLocation = subscribeHomeServicesEvent('get-worker-location', (payload) => {
      console.log('[home-services][track-worker] event received: get-worker-location', payload);

      if (!isWorkerLocationEvent(payload)) {
        console.warn('[home-services][track-worker] ignored invalid get-worker-location payload', payload);
        return;
      }

      const eventCustomerUserId = readString(payload.customerUserId);
      const activeCustomerUserId = currentUserIdRef.current;

      if (activeCustomerUserId && eventCustomerUserId && activeCustomerUserId !== eventCustomerUserId) {
        console.log('[home-services][track-worker] ignored worker location for different customer', {
          activeCustomerUserId,
          eventCustomerUserId,
        });
        return;
      }

      console.log('[home-services][track-worker] applying worker location update', {
        latitude: payload.latitude,
        longitude: payload.longitude,
        workerUserId: payload.workerUserId,
        customerUserId: payload.customerUserId,
      });

      setWorkerLocation({
        latitude: payload.latitude,
        longitude: payload.longitude,
      });
    });

    return () => {
      unsubscribeStatus();
      unsubscribeLocation();
    };
  }, [queryClient, token]);

  return {
    liveBookingData,
    workerLocation,
  };
}
