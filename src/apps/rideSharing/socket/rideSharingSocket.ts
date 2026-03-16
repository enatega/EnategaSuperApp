import { socketClient } from '../../../general/services/socket';
import type { SocketAck, SocketSubscriptionCleanup } from '../../../general/services/socket';
import type {
  RideSharingClientEventMap,
  RideSharingClientEventName,
  RideSharingServerEventMap,
  RideSharingServerEventName,
} from './rideSharingSocket.types';

export function emitRideSharingEvent<TEvent extends RideSharingClientEventName>(
  event: TEvent,
  payload: RideSharingClientEventMap[TEvent],
  ack?: SocketAck,
) {
  return socketClient.emit(event, payload, ack);
}

export function subscribeRideSharingEvent<
  TEvent extends RideSharingServerEventName,
>(
  event: TEvent,
  handler: (payload: RideSharingServerEventMap[TEvent]) => void,
): SocketSubscriptionCleanup {
  return socketClient.subscribe<[RideSharingServerEventMap[TEvent]]>(
    event,
    handler,
  );
}

export function offRideSharingEvent<TEvent extends RideSharingServerEventName>(
  event: TEvent,
  handler?: (payload: RideSharingServerEventMap[TEvent]) => void,
) {
  if (!handler) {
    socketClient.off(event);
    return;
  }

  socketClient.off(event, handler as (...args: unknown[]) => void);
}
