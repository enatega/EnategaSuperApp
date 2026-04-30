export type SocketEventHandler<TArgs extends unknown[] = unknown[]> = (
  ...args: TArgs
) => void;

export type SocketSentMessage = {
  sender: string;
  receiver: string;
  text: string;
};

export type SocketReceivedMessage = {
  sender: string;
  receiver: string;
  text: string;
};

export type SocketAck<TResponse = unknown> = (response: TResponse) => void;

export type SocketAuthPayload = {
  token?: string;
};

export type SocketLifecycleState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'disconnected';

export type SocketSubscriptionCleanup = () => void;

export type SocketTransportOrder =
  | readonly ['polling', 'websocket']
  | readonly ['websocket', 'polling']
  | readonly ['websocket'];
