import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { AppState, type AppStateStatus } from 'react-native';

type Params = {
  enabled?: boolean;
  onActive: () => void | Promise<void>;
  cooldownMs?: number;
};

export default function useRefetchOnAppActive({
  enabled = true,
  onActive,
  cooldownMs = 1500,
}: Params) {
  const isFocused = useIsFocused();
  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);
  const lastTriggeredAtRef = React.useRef(0);

  React.useEffect(() => {
    if (!enabled || !isFocused) {
      return undefined;
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      const isReturningToActive =
        (previousState === 'background' || previousState === 'inactive') &&
        nextState === 'active';

      if (!isReturningToActive) {
        return;
      }

      const now = Date.now();
      if (now - lastTriggeredAtRef.current < cooldownMs) {
        return;
      }

      lastTriggeredAtRef.current = now;
      void onActive();
    });

    return () => {
      subscription.remove();
    };
  }, [cooldownMs, enabled, isFocused, onActive]);
}
