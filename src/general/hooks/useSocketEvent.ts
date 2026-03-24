import { useEffect, useRef } from 'react';
import { socketClient } from '../services/socket';
import type { SocketEventHandler } from '../services/socket';

type Options = {
  enabled?: boolean;
};

export function useSocketEvent<TArgs extends unknown[] = [unknown]>(
  event: string,
  handler: SocketEventHandler<TArgs>,
  options?: Options,
) {
  const { enabled = true } = options ?? {};
  const latestHandlerRef = useRef(handler);
  const stableHandlerRef = useRef<SocketEventHandler<TArgs>>(
    ((...args: TArgs) => latestHandlerRef.current(...args)) as SocketEventHandler<TArgs>,
  );

  useEffect(() => {
    latestHandlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    return socketClient.subscribe(event, stableHandlerRef.current);
  }, [enabled, event]);
}
