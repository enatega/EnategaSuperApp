import { useCallback, useEffect, useRef } from 'react';
import { useAuthSessionQuery } from '../../../general/hooks/useAuthQueries';
import { useSocketEvent } from '../../../general/hooks/useSocketEvent';
import type { ActiveRidePayload } from '../api/types';
import { useActiveRide } from './useRideQueries';
import { useActiveRideStore } from '../stores/useActiveRideStore';
import { useActiveRideRequestStore } from '../stores/useActiveRideRequestStore';
import { useCompletedRideFeedbackStore } from '../stores/useCompletedRideFeedbackStore';
import {
  getActiveRideDriverUserId,
  mapActiveRideToCompletedRideFeedbackData,
} from '../utils/activeRideMapper';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function withDriverLocation(activeRide: ActiveRidePayload | null, payload: Record<string, unknown>) {
  if (!activeRide) {
    return activeRide;
  }

  const driverRecord = activeRide.driver;
  const driverUserRecord = driverRecord?.user;

  if (!driverRecord || !driverUserRecord) {
    return activeRide;
  }

  const latitude = Number(payload.latitude);
  const longitude = Number(payload.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return activeRide;
  }

  const nextCurrentLocation = {
    ...(asRecord(driverUserRecord.current_location) ?? {}),
    latitude,
    longitude,
    lat: latitude,
    lng: longitude,
    heading: typeof payload.heading === 'number' ? payload.heading : Number(payload.heading),
    speed: typeof payload.speed === 'number' ? payload.speed : Number(payload.speed),
    timestamp: typeof payload.timestamp === 'number' ? payload.timestamp : Number(payload.timestamp),
  };

  const nextDriverUser = {
    ...driverUserRecord,
    current_location: nextCurrentLocation,
  };
  const nextDriver = {
    ...driverRecord,
    user: nextDriverUser,
  };
  return {
    ...activeRide,
    driver: nextDriver,
  };
}

function isRideStatusEventPayload(value: unknown): value is Record<string, unknown> {
  const record = asRecord(value);
  return Boolean(record);
}

function readString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

type Options = {
  enabled?: boolean;
};

export default function useActiveRideSocketSync(options?: Options) {
  const isEnabled = options?.enabled ?? true;
  const activeRide = useActiveRideStore((state) => state.activeRide);
  const hasActiveRideRequest = useActiveRideRequestStore((state) => Boolean(state.activeRideRequest));
  const setActiveRide = useActiveRideStore((state) => state.setActiveRide);
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const feedbackRide = useCompletedRideFeedbackStore((state) => state.feedbackRide);
  const setFeedbackRide = useCompletedRideFeedbackStore((state) => state.setFeedbackRide);
  const hasActiveRide = Boolean(activeRide);
  const activeRideRef = useRef(activeRide);
  const feedbackRideRef = useRef(feedbackRide);
  const completedFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authSessionQuery = useAuthSessionQuery();
  const isActiveRideSyncEnabled = isEnabled && !hasActiveRideRequest;

  useEffect(() => {
    activeRideRef.current = activeRide;
  }, [activeRide]);

  useEffect(() => {
    feedbackRideRef.current = feedbackRide;
  }, [feedbackRide]);

  useEffect(() => () => {
    if (completedFeedbackTimeoutRef.current) {
      clearTimeout(completedFeedbackTimeoutRef.current);
    }
  }, []);

  const activeRideQuery = useActiveRide({
    enabled: isActiveRideSyncEnabled,
  });

  const syncFromServer = useCallback(async () => {
    const result = await activeRideQuery.refetch();
    const nextRide = result.data ?? null;

    if (nextRide) {
      clearActiveRideRequest();
      setActiveRide(nextRide);
      return;
    }

    clearActiveRide();
  }, [activeRideQuery, clearActiveRide, clearActiveRideRequest, setActiveRide]);

  useEffect(() => {
    if (!isActiveRideSyncEnabled) {
      return;
    }

    if (!activeRideQuery.data) {
      if (hasActiveRide && activeRideQuery.status === 'success') {
        clearActiveRide();
      }
      return;
    }

    if (activeRideQuery.data !== activeRide) {
      clearActiveRideRequest();
      setActiveRide(activeRideQuery.data);
    }
  }, [
    activeRide,
    activeRideQuery.data,
    activeRideQuery.status,
    clearActiveRide,
    clearActiveRideRequest,
    hasActiveRide,
    hasActiveRideRequest,
    isActiveRideSyncEnabled,
    setActiveRide,
  ]);

  useSocketEvent<[unknown]>(
    'get-rider-location',
    (payload) => {
      const record = asRecord(payload);
      if (!record) {
        return;
      }

      const currentCustomerUserId = authSessionQuery.data?.user?.id;
      const activeRideDriverUserId = getActiveRideDriverUserId(activeRideRef.current);
      const eventCustomerUserId = readString(record.customerUserId, record.customer_user_id);
      const eventRiderUserId = readString(record.riderUserId, record.rider_user_id);

      if (currentCustomerUserId && eventCustomerUserId && currentCustomerUserId !== eventCustomerUserId) {
        return;
      }

      if (activeRideDriverUserId && eventRiderUserId && activeRideDriverUserId !== eventRiderUserId) {
        return;
      }

      const nextRide = withDriverLocation(activeRideRef.current, record);
      if (nextRide !== activeRideRef.current) {
        setActiveRide(nextRide);
      }
    },
    { enabled: isActiveRideSyncEnabled && hasActiveRide },
  );

  useSocketEvent<[unknown]>('ride-started', () => {
    void syncFromServer();
  }, { enabled: isActiveRideSyncEnabled && hasActiveRide });

  useSocketEvent<[unknown]>('ride-completed', () => {
    const completedRideFeedback = mapActiveRideToCompletedRideFeedbackData(activeRideRef.current);
    const shouldQueueFeedback = Boolean(
      completedRideFeedback
      && feedbackRideRef.current?.rideId !== completedRideFeedback.rideId,
    );

    if (completedFeedbackTimeoutRef.current) {
      clearTimeout(completedFeedbackTimeoutRef.current);
      completedFeedbackTimeoutRef.current = null;
    }

    if (shouldQueueFeedback && completedRideFeedback) {
      completedFeedbackTimeoutRef.current = setTimeout(() => {
        setFeedbackRide(completedRideFeedback);
        completedFeedbackTimeoutRef.current = null;
      }, 2500);
    }

    void syncFromServer();
  }, { enabled: isActiveRideSyncEnabled && hasActiveRide });

  useSocketEvent<[unknown]>(
    'ride-status-updated',
    (payload) => {
      if (!isRideStatusEventPayload(payload)) {
        return;
      }

      void syncFromServer();
    },
    { enabled: isActiveRideSyncEnabled && hasActiveRide },
  );

  useSocketEvent<[unknown]>(
    'driver-reached',
    () => {
      void syncFromServer();
    },
    { enabled: isActiveRideSyncEnabled && hasActiveRide },
  );
}
