import { useEffect, useRef, useState } from 'react';
import { rideService } from '../api/rideService';
import { useActiveRideRequestStore } from '../stores/useActiveRideRequestStore';

type Options = {
  enabled?: boolean;
};

const MAX_BOOTSTRAP_RETRIES = 2;
const BOOTSTRAP_RETRY_DELAY_MS = 450;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
      const hasLocalActiveRequestAtStart = Boolean(activeRideRequest?.id);

      // Avoid wiping an in-memory active request on eventual-consistency gaps right after create.
      // We do a couple of short retries before deciding to clear.
      try {
        for (let attempt = 0; attempt <= MAX_BOOTSTRAP_RETRIES; attempt += 1) {
          const response = await rideService.getActiveRideRequest();
          if (!isMountedRef.current) {
            return;
          }

          if (response.success && response.activeRideRequest) {
            setActiveRideRequest(response.activeRideRequest);
            return;
          }

          const canRetry = hasLocalActiveRequestAtStart && attempt < MAX_BOOTSTRAP_RETRIES;
          if (canRetry) {
            await delay(BOOTSTRAP_RETRY_DELAY_MS * (attempt + 1));
            continue;
          }

          clearActiveRideRequest();
          return;
        }
      } catch {
        if (isMountedRef.current) {
          if (!hasLocalActiveRequestAtStart) {
            clearActiveRideRequest();
          }
        }
      } finally {
        if (isMountedRef.current) {
          setHasChecked(true);
        }
      }
    };

    void initializeActiveRideRequest();
  }, [activeRideRequest?.id, clearActiveRideRequest, isEnabled, setActiveRideRequest]);

  return {
    activeRideRequest,
    hasActiveRideRequest: Boolean(activeRideRequest),
    hasChecked,
  };
}
