import { useEffect, useRef, useState } from 'react';
import { rideService } from '../api/rideService';
import { useActiveRideRequestStore } from '../stores/useActiveRideRequestStore';

type Options = {
  enabled?: boolean;
};

export default function useInitializeActiveRideRequest(options?: Options) {
  const isEnabled = options?.enabled ?? true;
  const activeRideRequest = useActiveRideRequestStore((state) => state.activeRideRequest);
  const setActiveRideRequest = useActiveRideRequestStore((state) => state.setActiveRideRequest);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const [hasChecked, setHasChecked] = useState(false);
  const hasStartedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isEnabled || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const initializeActiveRideRequest = async () => {
      try {
        const response = await rideService.getActiveRideRequest();
        if (!isMountedRef.current) {
          return;
        }

        if (response.success && response.activeRideRequest) {
          setActiveRideRequest(response.activeRideRequest);
        } else {
          clearActiveRideRequest();
        }
      } catch {
        if (isMountedRef.current) {
          clearActiveRideRequest();
        }
      } finally {
        if (isMountedRef.current) {
          setHasChecked(true);
        }
      }
    };

    void initializeActiveRideRequest();
  }, [clearActiveRideRequest, isEnabled, setActiveRideRequest]);

  return {
    activeRideRequest,
    hasActiveRideRequest: Boolean(activeRideRequest),
    hasChecked,
  };
}
