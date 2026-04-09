import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useAuthSessionQuery } from '../../../general/hooks/useAuthQueries';
import { deliveriesSocketClient } from '../socket/deliveriesSocket';

type Options = {
  disconnectOnBackground?: boolean;
  enabled?: boolean;
};

export function useDeliveriesSocketSession(options?: Options) {
  const { enabled = true, disconnectOnBackground = true } = options ?? {};
  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  const userId = sessionQuery.data?.user?.id ?? null;
  const tokenRef = useRef<string | null>(token);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    void deliveriesSocketClient.updateSession({ token, userId });

    if (!enabled || !token) {
      deliveriesSocketClient.disconnectIfIdle();
      return;
    }

    void deliveriesSocketClient.connect();

    return () => {
      deliveriesSocketClient.disconnectIfIdle();
    };
  }, [enabled, token, userId]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (
        disconnectOnBackground
        && previousState === 'active'
        && nextState !== 'active'
      ) {
        deliveriesSocketClient.disconnectIfIdle();
        return;
      }

      if (nextState === 'active' && tokenRef.current) {
        void deliveriesSocketClient.connect();
      }
    });

    return () => subscription.remove();
  }, [disconnectOnBackground, enabled]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    return NetInfo.addEventListener((state) => {
      const isReachable = state.isConnected && state.isInternetReachable !== false;

      if (!isReachable || !tokenRef.current || appStateRef.current !== 'active') {
        return;
      }

      void deliveriesSocketClient.connect();
    });
  }, [enabled]);
}
