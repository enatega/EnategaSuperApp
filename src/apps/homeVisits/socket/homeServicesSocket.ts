import { io, type ManagerOptions, type Socket, type SocketOptions } from 'socket.io-client';
import { tokenManager } from '../../../general/api/apiClient';
import type { SocketSubscriptionCleanup } from '../../../general/services/socket';
import {
  socketPath,
  websocketFirstSocketOptions,
} from '../../../general/services/socket/socket.config';
import type {
  HomeServicesClientEventMap,
  HomeServicesClientEventName,
  HomeServicesServerEventMap,
  HomeServicesServerEventName,
  HomeServicesSocketAck,
} from './homeServicesSocket.types';

type HomeServicesSocketOptions = Partial<ManagerOptions & SocketOptions>;

type HomeServicesSocketEventHandler<TArgs extends unknown[] = [unknown]> = (
  ...args: TArgs
) => void;

type HomeServicesSocketSession = {
  token: string | null;
  userId: string | null;
};

function normalizeUrl(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function buildHomeServicesSocketUrl() {
  return normalizeUrl(
    process.env.EXPO_PUBLIC_HOME_SERVICES_SOCKET_URL
      ?? 'https://enatega-super-app-production.up.railway.app/home-services',
  );
}

class HomeServicesSocketClient {
  private socket: Socket | null = null;
  private authToken: string | null = null;
  private currentUserId: string | null = null;
  private retainCount = 0;
  private readonly listenerRegistry = new Map<
    string,
    Map<HomeServicesSocketEventHandler, HomeServicesSocketEventHandler>
  >();

  private buildAuth(token: string | null) {
    return token ? { token } : {};
  }

  private emitAddUser(socket: Socket) {
    if (!this.currentUserId) {
      console.log('[home-services][socket] add-user skipped: missing currentUserId');
      return;
    }

    console.log('[home-services][socket] add-user emit', {
      userId: this.currentUserId,
    });
    socket.emit('add-user', this.currentUserId);
  }

  private bindLifecycleListeners(socket: Socket) {
    socket.on('connect', () => {
      console.log('[home-services][socket] connected', {
        id: socket.id,
        connected: socket.connected,
        userId: this.currentUserId,
      });
      this.emitAddUser(socket);
    });
  }

  private async ensureSocket(options?: HomeServicesSocketOptions) {
    const token = this.authToken ?? (await tokenManager.getToken());
    this.authToken = token;

    if (this.socket) {
      this.socket.auth = this.buildAuth(token);
      return this.socket;
    }

    this.socket = io(buildHomeServicesSocketUrl(), {
      ...websocketFirstSocketOptions,
      ...options,
      auth: this.buildAuth(token),
      path: socketPath,
    });

    this.bindLifecycleListeners(this.socket);

    return this.socket;
  }

  async connect(options?: HomeServicesSocketOptions) {
    const socket = await this.ensureSocket(options);

    if (!this.authToken) {
      return socket;
    }

    if (!socket.connected) {
      socket.connect();
    } else {
      this.emitAddUser(socket);
    }

    return socket;
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  disconnect() {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.disconnect();
  }

  disconnectIfIdle() {
    if (this.hasActiveConsumers()) {
      return;
    }

    this.disconnect();
  }

  retain() {
    this.retainCount += 1;
  }

  release() {
    this.retainCount = Math.max(0, this.retainCount - 1);

    if (this.retainCount === 0) {
      this.disconnect();
    }
  }

  hasActiveConsumers() {
    return this.retainCount > 0;
  }

  async updateSession(session: HomeServicesSocketSession) {
    const nextToken = session.token;
    const nextUserId = session.userId;
    const tokenChanged = this.authToken !== nextToken;

    this.authToken = nextToken;
    this.currentUserId = nextUserId;

    if (!this.socket) {
      return;
    }

    this.socket.auth = this.buildAuth(nextToken);

    if (!nextToken) {
      this.disconnect();
      return;
    }

    if (tokenChanged && this.socket.connected) {
      this.socket.disconnect().connect();
      return;
    }

    if (this.socket.connected) {
      this.emitAddUser(this.socket);
    }
  }

  emit<TPayload = unknown, TAck = unknown>(
    event: string,
    payload?: TPayload,
    ack?: HomeServicesSocketAck<TAck>,
  ) {
    if (!this.socket) {
      return false;
    }

    if (payload === undefined && ack) {
      this.socket.emit(event, ack);
      return true;
    }

    if (payload === undefined) {
      this.socket.emit(event);
      return true;
    }

    if (ack) {
      this.socket.emit(event, payload, ack);
      return true;
    }

    this.socket.emit(event, payload);
    return true;
  }

  subscribe<TArgs extends unknown[] = [unknown]>(
    event: string,
    handler: HomeServicesSocketEventHandler<TArgs>,
  ): SocketSubscriptionCleanup {
    const baseHandler = handler as unknown as HomeServicesSocketEventHandler;
    const existingHandlers =
      this.listenerRegistry.get(event)
      ?? new Map<HomeServicesSocketEventHandler, HomeServicesSocketEventHandler>();
    const previousWrappedHandler = existingHandlers.get(baseHandler);

    if (previousWrappedHandler && this.socket) {
      this.socket.off(event, previousWrappedHandler);
    }

    const wrappedHandler: HomeServicesSocketEventHandler = (...args) => {
      handler(...(args as unknown as TArgs));
    };

    existingHandlers.set(baseHandler, wrappedHandler);
    this.listenerRegistry.set(event, existingHandlers);

    if (this.socket) {
      this.socket.on(event, wrappedHandler);
    } else {
      void this.ensureSocket().then((socket) => {
        const latestWrappedHandler = this.listenerRegistry.get(event)?.get(baseHandler);

        if (!latestWrappedHandler) {
          return;
        }

        socket.on(event, latestWrappedHandler);
      });
    }

    return () => {
      const wrapped = this.listenerRegistry.get(event)?.get(baseHandler);

      if (!wrapped) {
        return;
      }

      if (this.socket) {
        this.socket.off(event, wrapped);
      }

      const eventHandlers = this.listenerRegistry.get(event);
      eventHandlers?.delete(baseHandler);

      if (eventHandlers && eventHandlers.size === 0) {
        this.listenerRegistry.delete(event);
      }
    };
  }

  off(event: string, handler?: HomeServicesSocketEventHandler) {
    if (!this.socket) {
      if (!handler) {
        this.listenerRegistry.delete(event);
      } else {
        this.listenerRegistry.get(event)?.delete(handler);
      }
      return;
    }

    if (!handler) {
      this.socket.off(event);
      this.listenerRegistry.delete(event);
      return;
    }

    const wrapped = this.listenerRegistry.get(event)?.get(handler);

    if (!wrapped) {
      return;
    }

    this.socket.off(event, wrapped);

    const eventHandlers = this.listenerRegistry.get(event);
    eventHandlers?.delete(handler);

    if (eventHandlers && eventHandlers.size === 0) {
      this.listenerRegistry.delete(event);
    }
  }
}

export const homeServicesSocketClient = new HomeServicesSocketClient();

export function emitHomeServicesEvent<TEvent extends HomeServicesClientEventName>(
  event: TEvent,
  payload: HomeServicesClientEventMap[TEvent],
  ack?: HomeServicesSocketAck,
) {
  return homeServicesSocketClient.emit(event, payload, ack);
}

export function subscribeHomeServicesEvent<TEvent extends HomeServicesServerEventName>(
  event: TEvent,
  handler: (payload: HomeServicesServerEventMap[TEvent]) => void,
): SocketSubscriptionCleanup {
  return homeServicesSocketClient.subscribe<[HomeServicesServerEventMap[TEvent]]>(
    event,
    handler,
  );
}

export function offHomeServicesEvent<TEvent extends HomeServicesServerEventName>(
  event: TEvent,
  handler?: (payload: HomeServicesServerEventMap[TEvent]) => void,
) {
  if (!handler) {
    homeServicesSocketClient.off(event);
    return;
  }

  homeServicesSocketClient.off(event, handler as HomeServicesSocketEventHandler);
}
