import React, { useEffect, useMemo } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import RideOptionsScreen from '../rideOptions/RideOptionsScreen';
import { useActiveRideStore } from '../../stores/useActiveRideStore';
import { useActiveRideRequestStore } from '../../stores/useActiveRideRequestStore';
import useInitializeRideState from '../../hooks/useInitializeRideState';
import useRideSocketSync from '../../hooks/useRideSocketSync';
import ActiveRideView from '../activeRide/components/ActiveRideView';
import FindingRideView from '../findingRide/components/FindingRideView';
import CompletedRideFeedbackSheet from '../activeRide/components/CompletedRideFeedbackSheet';
import { useCompletedRideFeedbackController } from '../activeRide/hooks/useCompletedRideFeedbackController';
import type { ActiveRidePayload, ActiveRideRequestPayload } from '../../api/types';

function readNumber(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number.parseFloat(value);
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function hasValidCoordinates(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as {
    lat?: unknown;
    lng?: unknown;
    latitude?: unknown;
    longitude?: unknown;
    coordinates?: {
      coordinates?: unknown;
    } | null;
  };
  const latitude = readNumber(record.lat, record.latitude);
  const longitude = readNumber(record.lng, record.longitude);

  if (latitude !== undefined && longitude !== undefined) {
    return true;
  }

  const geoJsonCoordinates = Array.isArray(record.coordinates?.coordinates)
    ? record.coordinates?.coordinates
    : null;

  if (!geoJsonCoordinates || geoJsonCoordinates.length < 2) {
    return false;
  }

  return (
    readNumber(geoJsonCoordinates[1]) !== undefined
    && readNumber(geoJsonCoordinates[0]) !== undefined
  );
}

function hasValidLatLngLike(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as {
    lat?: unknown;
    lng?: unknown;
    latitude?: unknown;
    longitude?: unknown;
  };
  const latitude = readNumber(record.lat, record.latitude);
  const longitude = readNumber(record.lng, record.longitude);
  return latitude !== undefined && longitude !== undefined;
}

function hasActiveRideOverlay(activeRide: ActiveRidePayload | null) {
  return Boolean(
    activeRide
    && (activeRide.ride_id || (activeRide as { id?: unknown }).id)
    && hasValidCoordinates(activeRide.pickup)
    && hasValidCoordinates(activeRide.dropoff),
  );
}

function hasFindingRideOverlay(activeRideRequest: ActiveRideRequestPayload | null) {
  return Boolean(
    activeRideRequest
    && (activeRideRequest.id || (activeRideRequest as { ride_request_id?: unknown }).ride_request_id)
    && hasValidLatLngLike(activeRideRequest.pickup)
    && hasValidLatLngLike(activeRideRequest.dropoff),
  );
}

export default function RideSharingHomeScreen() {
  const activeRide = useActiveRideStore((state) => state.activeRide);
  const activeRideRequest = useActiveRideRequestStore((state) => state.activeRideRequest);
  const { hasCheckedRideState } = useInitializeRideState();
  const {
    feedbackRide: pendingFeedbackRide,
    isSubmitting: isFeedbackSubmitting,
    handleClose: handleCloseFeedback,
    handleSubmit: handleSubmitFeedback,
  } = useCompletedRideFeedbackController();

  useRideSocketSync({ enableActiveRideSync: hasCheckedRideState });

  const shouldShowActiveRide = hasActiveRideOverlay(activeRide);
  const shouldShowFindingRide = !shouldShowActiveRide && hasFindingRideOverlay(activeRideRequest);
  const shouldShowFeedback = Boolean(pendingFeedbackRide);

  console.log('Rendering HomeScreen', {
    activeRide,
    activeRideRequest,
    shouldShowActiveRide,
    shouldShowFindingRide,
    shouldShowFeedback,
  });

  const overlayView = useMemo(() => {
    if (shouldShowActiveRide && activeRide) {
      return <ActiveRideView activeRide={activeRide} />;
    }

    if (shouldShowFindingRide && activeRideRequest) {
      return <FindingRideView activeRideRequest={activeRideRequest} />;
    }

    return null;
  }, [activeRide, activeRideRequest, shouldShowActiveRide, shouldShowFindingRide]);

  const hasOverlay = shouldShowActiveRide || shouldShowFindingRide || shouldShowFeedback;

  useEffect(() => {
    if (!hasOverlay) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [hasOverlay]);

  return (
    <View style={styles.container}>
      <RideOptionsScreen />

      {hasOverlay ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          {overlayView}
          {pendingFeedbackRide ? (
            <CompletedRideFeedbackSheet
              feedbackRide={pendingFeedbackRide}
              isSubmitting={isFeedbackSubmitting}
              onClose={handleCloseFeedback}
              onSubmit={handleSubmitFeedback}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 12,
  },
});
