import type { ManagerOptions, SocketOptions } from 'socket.io-client';
import { apiConfig } from '../../config/apiConfig';
import type { SocketTransportOrder } from './socket.types';

function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const DEFAULT_SOCKET_TRANSPORTS: SocketTransportOrder = [
  'polling',
  'websocket',
];

export const WEBSOCKET_FIRST_TRANSPORTS: SocketTransportOrder = [
  'websocket',
];

export const socketBaseUrl = normalizeUrl(
  process.env.EXPO_PUBLIC_SOCKET_URL ?? apiConfig.baseUrl,
);

export const socketPath = process.env.EXPO_PUBLIC_SOCKET_PATH ?? '/socket.io';

export const defaultSocketOptions: Partial<ManagerOptions & SocketOptions> = {
  autoConnect: false,
  path: socketPath,
  transports: [...DEFAULT_SOCKET_TRANSPORTS],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1_000,
  reconnectionDelayMax: 10_000,
  randomizationFactor: 0.5,
  timeout: 20_000,
};

export const websocketFirstSocketOptions: Partial<
  ManagerOptions & SocketOptions
> = {
  ...defaultSocketOptions,
  transports: [...WEBSOCKET_FIRST_TRANSPORTS],
  tryAllTransports: false,
};
