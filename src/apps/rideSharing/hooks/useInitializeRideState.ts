import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import useInitializeActiveRide from './useInitializeActiveRide';
import useInitializeActiveRideRequest from './useInitializeActiveRideRequest';
import { useActiveRideStore } from '../stores/useActiveRideStore';

export default function useInitializeRideState() {
  const queryClient = useQueryClient();
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
  const {
    hasActiveRideRequest,
    hasChecked: hasCheckedActiveRideRequest,
  } = useInitializeActiveRideRequest();
  const { hasChecked: hasCheckedActiveRide } = useInitializeActiveRide({
    enabled: hasCheckedActiveRideRequest && !hasActiveRideRequest,
  });

  useEffect(() => {
    if (!hasCheckedActiveRideRequest || !hasActiveRideRequest) {
      return;
    }

    queryClient.setQueryData(rideKeys.activeRide(), null);
    clearActiveRide();
  }, [
    clearActiveRide,
    hasActiveRideRequest,
    hasCheckedActiveRideRequest,
    queryClient,
  ]);

  return {
    hasCheckedRideState: hasCheckedActiveRideRequest && (hasActiveRideRequest || hasCheckedActiveRide),
    hasActiveRideRequest,
  };
}
