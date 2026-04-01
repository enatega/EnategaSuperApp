import { io, type ManagerOptions, type Socket, type SocketOptions } from 'socket.io-client';
import { tokenManager } from '../../api/apiClient';
import { defaultSocketOptions, socketBaseUrl, websocketFirstSocketOptions } from './socket.config';
import { socketLogger } from './socket.logger';
import type {
  SocketAck,
  SocketAuthPayload,
  SocketEventHandler,
  SocketReceivedMessage,
  SocketLifecycleState,
  SocketSentMessage,
  SocketSubscriptionCleanup,
} from './socket.types';

type SocketIoOptions = Partial<ManagerOptions & SocketOptions>;

class SocketClient {
  private socket: Socket | null = null;
  private authToken: string | null = null;
  private currentUserId: string | null = null;
  private isIntentionalDisconnect = false;
  private lifecycleState: SocketLifecycleState = 'idle';
  private readonly listenerRegistry = new Map<
    string,
    Map<SocketEventHandler, SocketEventHandler>
  >();

  private buildAuth(token: string | null): SocketAuthPayload {
    return token ? { token } : {};
  }

  private setLifecycleState(nextState: SocketLifecycleState) {
    this.lifecycleState = nextState;
  }

  private emitAddUser(socket: Socket) {
    if (!this.currentUserId) {
      socketLogger.debug('Skipping add-user emit because no current user id is available');
      return;
    }

    socket.emit('add-user', this.currentUserId);
    socketLogger.info('Emitted add-user', {
      userId: this.currentUserId,
      socketId: socket.id,
    });
  }

  private bindLifecycleListeners(socket: Socket) {
    socket.on('connect', () => {
      this.setLifecycleState('connected');
      this.isIntentionalDisconnect = false;
      this.emitAddUser(socket);

      socketLogger.info('Connected', {
        id: socket.id,
        transport: socket.io.engine.transport.name,
      });
    });

    socket.on('disconnect', (reason: string) => {
      this.setLifecycleState('disconnected');

      socketLogger.info('Disconnected', {
        reason,
        intentional:
          this.isIntentionalDisconnect || reason === 'io client disconnect',
        willReconnect: socket.active,
      });
    });

    socket.on('connect_error', (error: Error) => {
      this.setLifecycleState('disconnected');
      socketLogger.warn('Connect error', {
        message: error.message,
        active: socket.active,
      });
    });

    socket.io.on('reconnect_attempt', (attempt: number) => {
      this.setLifecycleState('connecting');
      socketLogger.info('Reconnect attempt', { attempt });
    });

    socket.io.on('reconnect', (attempt: number) => {
      this.setLifecycleState('connected');
      socketLogger.info('Reconnect success', { attempt });
    });

    socket.io.on('reconnect_error', (error: Error) => {
      socketLogger.warn('Reconnect error', { message: error.message });
    });

    socket.io.on('reconnect_failed', () => {
      socketLogger.error('Reconnect exhausted');
    });

    socket.onAny((event, ...args) => {
      console.log('[socket] incoming event:', event, args);
      socketLogger.info('Incoming socket event', {
        event,
        args,
        connected: socket.connected,
        socketId: socket.id,
      });
    });
  }

  private ensureSocket(token: string | null, options?: SocketIoOptions) {
    if (this.socket) {
      this.socket.auth = this.buildAuth(token);
      return this.socket;
    }

    this.socket = io(socketBaseUrl, {
      ...websocketFirstSocketOptions,
      ...options,
      auth: this.buildAuth(token),
    });

    this.bindLifecycleListeners(this.socket);
    socketLogger.debug('Socket instance created', {
      url: socketBaseUrl,
      transports: this.socket.io.opts.transports,
    });

    return this.socket;
  }

  async connect(options?: SocketIoOptions) {
    const token = this.authToken ?? (await tokenManager.getToken());
    this.authToken = token;
    this.isIntentionalDisconnect = false;
    this.setLifecycleState('connecting');

    const socket = this.ensureSocket(token, options);
    // socket.auth = this.buildAuth(token);

    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  disconnect() {
    if (!this.socket) {
      this.setLifecycleState('disconnected');
      return;
    }

    this.isIntentionalDisconnect = true;
    this.setLifecycleState('disconnecting');
    this.socket.disconnect();
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  getSocket() {
    return this.socket;
  }

  getLifecycleState() {
    return this.lifecycleState;
  }

  emit<TPayload = unknown, TAck = unknown>(
    event: string,
    payload?: TPayload,
    ack?: SocketAck<TAck>,
  ) {
    const socket = this.socket;

    if (!socket) {
      socketLogger.warn('Emit skipped because socket was not initialized', {
        event,
      });
      return false;
    }

    if (payload === undefined && ack) {
      socket.emit(event, ack);
      return true;
    }

    if (payload === undefined) {
      socket.emit(event);
      return true;
    }

    if (ack) {
      socket.emit(event, payload, ack);
      return true;
    }

    socket.emit(event, payload);
    return true;
  }

  sendMessage(message: SocketSentMessage) {
    const socket = this.socket;

    if (!socket?.connected) {
      socketLogger.warn('Send message skipped because socket is not connected', {
        receiver: message.receiver,
        sender: message.sender,
      });
      return false;
    }

    socketLogger.info('Sending socket message', {
      receiver: message.receiver,
      sender: message.sender,
    });
    socket.emit('send-message', message);
    return true;
  }

  onReceiveMessage(
    handler: (message: SocketReceivedMessage) => void,
  ): SocketSubscriptionCleanup {
    return this.subscribe<[SocketReceivedMessage]>('receive-message', (message) => {
      console.log('Received socket message:', message);
      handler(message);
    });
  }

  subscribe<TArgs extends unknown[] = [unknown]>(
    event: string,
    handler: SocketEventHandler<TArgs>,
  ): SocketSubscriptionCleanup {
    const socket = this.ensureSocket(this.authToken);
    const existingHandlers =
      this.listenerRegistry.get(event)
      ?? new Map<SocketEventHandler, SocketEventHandler>();

    const baseHandler = handler as SocketEventHandler;
    const previousWrappedHandler = existingHandlers.get(baseHandler);
    if (previousWrappedHandler) {
      socket.off(event, previousWrappedHandler);
    }

    const wrappedHandler: SocketEventHandler = (...args) => {
      handler(...(args as TArgs));
    };

    existingHandlers.set(baseHandler, wrappedHandler);
    this.listenerRegistry.set(event, existingHandlers);
    console.log('[socket] subscribing to event:', event, {
      connected: socket.connected,
      lifecycleState: this.lifecycleState,
      socketId: socket.id,
    });
    socketLogger.info('Subscribed to socket event', {
      event,
      connected: socket.connected,
      lifecycleState: this.lifecycleState,
      socketId: socket.id,
    });
    socket.on(event, wrappedHandler);

    return () => {
      const wrapped = this.listenerRegistry.get(event)?.get(baseHandler);
      if (!wrapped) {
        return;
      }

      console.log('[socket] unsubscribing from event:', event, {
        connected: socket.connected,
        lifecycleState: this.lifecycleState,
        socketId: socket.id,
      });
      socket.off(event, wrapped);

      const eventHandlers = this.listenerRegistry.get(event);
      eventHandlers?.delete(baseHandler);
      if (eventHandlers && eventHandlers.size === 0) {
        this.listenerRegistry.delete(event);
      }
    };
  }

  off(event: string, handler?: SocketEventHandler) {
    if (!this.socket) {
      if (!handler) {
        this.listenerRegistry.delete(event);
      } else {
        this.listenerRegistry.get(event)?.delete(handler as SocketEventHandler);
      }
      return;
    }

    if (!handler) {
      this.socket.off(event);
      this.listenerRegistry.delete(event);
      return;
    }

    const wrapped = this.listenerRegistry.get(event)?.get(
      handler as SocketEventHandler,
    );
    if (!wrapped) {
      return;
    }

    this.socket.off(event, wrapped);

    const eventHandlers = this.listenerRegistry.get(event);
    eventHandlers?.delete(handler as SocketEventHandler);
    if (eventHandlers && eventHandlers.size === 0) {
      this.listenerRegistry.delete(event);
    }
  }

  async updateAuthToken(token: string | null) {
    const previousToken = this.authToken;
    this.authToken = token;

    if (!this.socket) {
      return;
    }

    this.socket.auth = this.buildAuth(token);

    if (previousToken === token) {
      return;
    }

    if (!token) {
      this.disconnect();
      return;
    }

    if (this.socket.connected) {
      socketLogger.info('Refreshing socket auth token');
      this.socket.disconnect().connect();
    }
  }

  updateCurrentUserId(userId: string | null) {
    this.currentUserId = userId;

    if (!this.socket?.connected || !userId) {
      return;
    }

    this.emitAddUser(this.socket);
  }
}

export const socketClient = new SocketClient();
