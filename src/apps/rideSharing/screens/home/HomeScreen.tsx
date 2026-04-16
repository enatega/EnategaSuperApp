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

function hasActiveRideOverlay(activeRide: ActiveRidePayload | null) {
  return Boolean(
    activeRide
    && activeRide.ride_id
    && activeRide.pickup_location
    && activeRide.dropoff_location
    && activeRide.pickup?.lat !== undefined
    && activeRide.pickup?.lng !== undefined
    && activeRide.dropoff?.lat !== undefined
    && activeRide.dropoff?.lng !== undefined,
  );
}

function hasFindingRideOverlay(activeRideRequest: ActiveRideRequestPayload | null) {
  return Boolean(
    activeRideRequest
    && activeRideRequest.id
    && activeRideRequest.pickup_location
    && activeRideRequest.dropoff_location
    && activeRideRequest.pickup?.lat !== undefined
    && activeRideRequest.pickup?.lng !== undefined
    && activeRideRequest.dropoff?.lat !== undefined
    && activeRideRequest.dropoff?.lng !== undefined,
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
