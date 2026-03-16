import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useAuthSessionQuery } from './useAuthQueries';
import { socketClient } from '../services/socket';

type Options = {
  enabled?: boolean;
  disconnectOnBackground?: boolean;
};

export function useSocketSession(options?: Options) {
  const { enabled = true, disconnectOnBackground = false } = options ?? {};
  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  const tokenRef = useRef<string | null>(token);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    void socketClient.updateAuthToken(token);

    if (!enabled) {
      socketClient.disconnect();
      return;
    }

    if (!token) {
      socketClient.disconnect();
      return;
    }

    void socketClient.connect();
  }, [enabled, token]);

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
        socketClient.disconnect();
        return;
      }

      if (nextState === 'active' && tokenRef.current) {
        void socketClient.connect();
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

      void socketClient.connect();
    });
  }, [enabled]);

  return {
    connect: socketClient.connect.bind(socketClient),
    disconnect: socketClient.disconnect.bind(socketClient),
    getSocket: socketClient.getSocket.bind(socketClient),
    isConnected: socketClient.isConnected.bind(socketClient),
    updateAuthToken: socketClient.updateAuthToken.bind(socketClient),
    lifecycleState: socketClient.getLifecycleState.bind(socketClient),
  };
}
