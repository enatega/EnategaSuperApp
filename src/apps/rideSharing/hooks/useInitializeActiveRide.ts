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

export default function useInitializeActiveRide(options?: Options) {
  const isEnabled = options?.enabled ?? true;
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const queryClient = useQueryClient();
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
      try {
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
        } else {
          clearActiveRide();
        }
      } catch {
        if (isMountedRef.current) {
          queryClient.setQueryData(rideKeys.activeRide(), null);
          clearActiveRide();
        }
      } finally {
        if (isMountedRef.current) {
          setHasChecked(true);
        }
      }
    };

    void initializeActiveRide();
  }, [clearActiveRide, isEnabled, navigation, queryClient, setActiveRide]);

  return {
    hasChecked,
  };
}
