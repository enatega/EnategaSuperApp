import { useEffect, useRef } from 'react';
import { rideService } from '../api/rideService';
import { useActiveRideStore } from '../stores/useActiveRideStore';
import { useActiveRideRequestStore } from '../stores/useActiveRideRequestStore';

export default function useBootstrapActiveRide() {
  const hasBootstrapped = useActiveRideStore((state) => state.hasBootstrapped);
  const isBootstrapping = useActiveRideStore((state) => state.isBootstrapping);
  const setActiveRide = useActiveRideStore((state) => state.setActiveRide);
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
  const startBootstrapping = useActiveRideStore((state) => state.startBootstrapping);
  const finishBootstrapping = useActiveRideStore((state) => state.finishBootstrapping);
  const setActiveRideRequest = useActiveRideRequestStore((state) => state.setActiveRideRequest);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (hasBootstrapped || isBootstrapping) {
      return;
    }

    const canCommit = () => isMountedRef.current;

    const bootstrap = async () => {
      startBootstrapping();

      try {
        const activeRideRequestResponse = await rideService.getActiveRideRequest();
        if (!canCommit()) {
          return;
        }

        const activeRideRequest = activeRideRequestResponse.activeRideRequest;
        if (activeRideRequestResponse.success && activeRideRequest) {
          setActiveRideRequest(activeRideRequest);
          clearActiveRide();
          return;
        }

        clearActiveRideRequest();

        const activeRide = await rideService.getActiveRide();
        if (!canCommit()) {
          return;
        }

        if (activeRide) {
          clearActiveRideRequest();
          setActiveRide(activeRide);
        } else {
          clearActiveRide();
        }
      } catch {
        if (canCommit()) {
          clearActiveRideRequest();
          clearActiveRide();
        }
      } finally {
        if (canCommit()) {
          finishBootstrapping();
        }
      }
    };

    void bootstrap();
  }, [
    clearActiveRide,
    finishBootstrapping,
    hasBootstrapped,
    isBootstrapping,
    clearActiveRideRequest,
    setActiveRide,
    setActiveRideRequest,
    startBootstrapping,
  ]);
}
