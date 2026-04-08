import { io, type ManagerOptions, type Socket, type SocketOptions } from "socket.io-client";
import { tokenManager } from "../../../general/api/apiClient";
import { apiConfig } from "../../../general/config/apiConfig";
import {
  socketPath,
  websocketFirstSocketOptions,
} from "../../../general/services/socket/socket.config";

type DeliveriesSocketOptions = Partial<ManagerOptions & SocketOptions>;

type DeliveriesSocketEventHandler<TArgs extends unknown[] = [unknown]> = (
  ...args: TArgs
) => void;

type DeliveriesSocketSession = {
  token: string | null;
  userId: string | null;
};

function normalizeUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function buildDeliveriesSocketUrl() {
  const baseUrl = normalizeUrl(
    process.env.EXPO_PUBLIC_SOCKET_URL ?? apiConfig.baseUrl,
  );

  return `${baseUrl}/deliveries`;
}

class DeliveriesSocketClient {
  private socket: Socket | null = null;
  private authToken: string | null = null;
  private currentUserId: string | null = null;
  private retainCount = 0;
  private readonly listenerRegistry = new Map<
    string,
    Map<DeliveriesSocketEventHandler, DeliveriesSocketEventHandler>
  >();

  private buildAuth(token: string | null) {
    return token ? { token } : {};
  }

  private emitAddUser(socket: Socket) {
    if (!this.currentUserId) {
      return;
    }

    socket.emit("add-user", this.currentUserId);
  }

  private bindLifecycleListeners(socket: Socket) {
    socket.on("connect", () => {
      this.emitAddUser(socket);
    });
  }

  private async ensureSocket(options?: DeliveriesSocketOptions) {
    const token = this.authToken ?? (await tokenManager.getToken());
    this.authToken = token;

    if (this.socket) {
      this.socket.auth = this.buildAuth(token);
      return this.socket;
    }

    this.socket = io(buildDeliveriesSocketUrl(), {
      ...websocketFirstSocketOptions,
      ...options,
      auth: this.buildAuth(token),
      path: socketPath,
    });

    this.bindLifecycleListeners(this.socket);

    return this.socket;
  }

  async connect(options?: DeliveriesSocketOptions) {
    const socket = await this.ensureSocket(options);

    if (!this.authToken) {
      return socket;
    }

    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  disconnect() {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.disconnect();
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

  async updateSession(session: DeliveriesSocketSession) {
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

  subscribe<TArgs extends unknown[] = [unknown]>(
    event: string,
    handler: DeliveriesSocketEventHandler<TArgs>,
  ) {
    const baseHandler = handler as unknown as DeliveriesSocketEventHandler;
    const existingHandlers =
      this.listenerRegistry.get(event)
      ?? new Map<DeliveriesSocketEventHandler, DeliveriesSocketEventHandler>();
    const previousWrappedHandler = existingHandlers.get(baseHandler);

    if (previousWrappedHandler && this.socket) {
      this.socket.off(event, previousWrappedHandler);
    }

    const wrappedHandler: DeliveriesSocketEventHandler = (...args) => {
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
}

export const deliveriesSocketClient = new DeliveriesSocketClient();
