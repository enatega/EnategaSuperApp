import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import { useActiveRideStore } from '../stores/useActiveRideStore';
import type { RideSharingStackParamList } from '../navigation/RideSharingNavigator';

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

export default function useInitializeActiveRide(options?: Options) {
  const isEnabled = options?.enabled ?? true;
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const queryClient = useQueryClient();
  const activeRide = useActiveRideStore((state) => state.activeRide);
  const setActiveRide = useActiveRideStore((state) => state.setActiveRide);
  const clearActiveRide = useActiveRideStore((state) => state.clearActiveRide);
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

    const initializeActiveRide = async () => {
      const hasLocalActiveRideAtStart = Boolean(activeRide?.ride_id);

      // Avoid clearing a live in-memory ride when server-read lags immediately after status changes.
      try {
        for (let attempt = 0; attempt <= MAX_BOOTSTRAP_RETRIES; attempt += 1) {
          const nextActiveRide = await rideService.getActiveRide();
          if (!isMountedRef.current) {
            return;
          }

          queryClient.setQueryData(rideKeys.activeRide(), nextActiveRide);

          if (nextActiveRide) {
            setActiveRide(nextActiveRide);

            const navigationState = navigation.getState();
            if (navigationState.index > 0) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'RideSharingHome' }],
              });
            }
            return;
          }

          const canRetry = hasLocalActiveRideAtStart && attempt < MAX_BOOTSTRAP_RETRIES;
          if (canRetry) {
            await delay(BOOTSTRAP_RETRY_DELAY_MS * (attempt + 1));
            continue;
          }

          clearActiveRide();
          return;
        }
      } catch {
        if (isMountedRef.current) {
          if (!hasLocalActiveRideAtStart) {
            queryClient.setQueryData(rideKeys.activeRide(), null);
            clearActiveRide();
          }
        }
      } finally {
        if (isMountedRef.current) {
          setHasChecked(true);
        }
      }
    };

    void initializeActiveRide();
  }, [activeRide?.ride_id, clearActiveRide, isEnabled, navigation, queryClient, setActiveRide]);

  return {
    hasChecked,
  };
}
