import React from 'react';
import type { LatLng } from 'react-native-maps';
import { subscribeHomeServicesEvent } from '../../socket/homeServicesSocket';
import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';
import {
  isWorkerLocationEvent,
  readString,
} from '../utils/trackWorkerLocation';

type Params = {
  currentUserId: string | null;
  initialBookingData: HomeVisitsSingleVendorBookingDetails | undefined;
  orderId: string;
  token: string | null;
};

export default function useTrackWorkerRealtime({
  currentUserId,
  initialBookingData,
  orderId,
  token,
}: Params) {
  const [liveBookingData, setLiveBookingData] = React.useState<HomeVisitsSingleVendorBookingDetails | null>(null);
  const [workerLocation, setWorkerLocation] = React.useState<LatLng | null>(null);

  const currentOrderIdRef = React.useRef(orderId);
  const currentUserIdRef = React.useRef<string | null>(currentUserId);

  React.useEffect(() => {
    currentOrderIdRef.current = orderId;
  }, [orderId]);

  React.useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  React.useEffect(() => {
    if (initialBookingData) {
      setLiveBookingData(initialBookingData);
    }
  }, [initialBookingData]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

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
      unsubscribeLocation();
    };
  }, [token]);

  return {
    liveBookingData,
    workerLocation,
  };
}
