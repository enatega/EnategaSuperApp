import type { SocketAck, SocketReceivedMessage, SocketSentMessage } from '../../../general/services/socket';
import type { DeliveryOrderStatus } from '../api/ordersServiceTypes';

export type DeliveriesSocketAck<TResponse = unknown> = SocketAck<TResponse>;

export type DeliveriesClientEventMap = {
  'send-message': SocketSentMessage;
};

export type DeliveriesServerEventMap = {
  'get-rider-location': {
    customerUserId?: string;
    latitude?: number;
    longitude?: number;
    riderUserId?: string;
  };
  'order-status-updated': {
    orderId?: string;
    riderId?: string | null;
    status?: DeliveryOrderStatus;
    updatedAt?: string;
  };
  'receive-message': SocketReceivedMessage;
};

export type DeliveriesClientEventName = keyof DeliveriesClientEventMap;
export type DeliveriesServerEventName = keyof DeliveriesServerEventMap;
