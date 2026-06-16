import React from 'react';
import type { LatLng } from 'react-native-maps';
import { subscribeHomeServicesEvent } from '../../socket/homeServicesSocket';
import type { WorkerLocationEvent } from '../../socket/homeServicesSocket.types';
import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';
import {
  extractWorkerLocation,
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
  const [trackingSnapshot, setTrackingSnapshot] = React.useState<WorkerLocationEvent | null>(null);

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
    if (!initialBookingData) {
      return;
    }

    const seededWorkerLocation = extractWorkerLocation(initialBookingData);
    if (seededWorkerLocation) {
      setWorkerLocation((current) => current ?? seededWorkerLocation);
    }

    const seededTrackingSnapshot = extractTrackingSnapshot(initialBookingData, orderId);
    if (seededTrackingSnapshot) {
      setTrackingSnapshot((current) => current ?? seededTrackingSnapshot);
    }
  }, [initialBookingData, orderId]);

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
      const eventOrderId = readString(payload.orderId);
      const activeCustomerUserId = currentUserIdRef.current;

      if (activeCustomerUserId && eventCustomerUserId && activeCustomerUserId !== eventCustomerUserId) {
        console.log('[home-services][track-worker] ignored worker location for different customer', {
          activeCustomerUserId,
          eventCustomerUserId,
        });
        return;
      }

      if (eventOrderId && eventOrderId !== currentOrderIdRef.current) {
        console.log('[home-services][track-worker] ignored worker location for different order', {
          activeOrderId: currentOrderIdRef.current,
          eventOrderId,
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
      setTrackingSnapshot(payload);
    });

    return () => {
      unsubscribeLocation();
    };
  }, [token]);

  return {
    liveBookingData,
    trackingSnapshot,
    workerLocation,
  };
}

function extractTrackingSnapshot(
  details: HomeVisitsSingleVendorBookingDetails,
  orderId: string,
): WorkerLocationEvent | null {
  const detailsRecord = details as Record<string, unknown>;
  const currentLocationRecord = toRecord(
    detailsRecord.currentLocation ?? detailsRecord.workerLocation,
  );
  const latitude = toNumber(currentLocationRecord?.latitude);
  const longitude = toNumber(currentLocationRecord?.longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return {
    orderId,
    latitude,
    longitude,
    distanceKm: toNumber(detailsRecord.distanceKm),
    estimatedMinutes: toNumber(detailsRecord.estimatedMinutes),
    destinationLatitude: toNumber(detailsRecord.destinationLatitude),
    destinationLongitude: toNumber(detailsRecord.destinationLongitude),
    routePath: normalizeRoutePath(detailsRecord.routePath),
  };
}

function normalizeRoutePath(value: unknown): LatLng[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const coordinates = value
    .map((point) => {
      const record = toRecord(point);
      const latitude = toNumber(record?.latitude);
      const longitude = toNumber(record?.longitude);

      if (latitude === null || longitude === null) {
        return null;
      }

      return { latitude, longitude };
    })
    .filter((point): point is LatLng => point !== null);

  return coordinates.length > 1 ? coordinates : null;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}
