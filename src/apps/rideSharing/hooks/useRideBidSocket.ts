import { useEffect } from 'react';
import { useSocketEvent } from '../../../general/hooks/useSocketEvent';
import { useActiveRideRequestStore } from '../stores/useActiveRideRequestStore';
import { useRideBidsStore } from '../stores/useRideBidsStore';
import { normalizeRideBidEvent } from '../utils/rideBidMapper';
import type { RideSharingServerEventMap } from '../socket/rideSharingSocket.types';

type Options = {
  enabled?: boolean;
  rideRequestId?: string;
};

export function useRideBidSocket(options?: Options) {
  const activeRideRequestId = useActiveRideRequestStore(
    (state) => state.activeRideRequest?.id,
  );
  const resolvedRideRequestId = options?.rideRequestId ?? activeRideRequestId;
  const isEnabled = options?.enabled ?? true;
  const syncRideRequest = useRideBidsStore((state) => state.syncRideRequest);
  const addBid = useRideBidsStore((state) => state.addBid);
  const removeBid = useRideBidsStore((state) => state.removeBid);

  useEffect(() => {
    if (!isEnabled || !resolvedRideRequestId) {
      return;
    }

    syncRideRequest(resolvedRideRequestId);
  }, [isEnabled, resolvedRideRequestId, syncRideRequest]);

  useSocketEvent<[RideSharingServerEventMap['received-bids']]>(
    'received-bids',
    (payload) => {
      console.log('[RideBidSocket] received-bids payload:', payload);

      if (!isEnabled || !resolvedRideRequestId) {
        console.log('[RideBidSocket] received-bids ignored:', {
          isEnabled,
          resolvedRideRequestId,
        });
        return;
      }

      const items = Array.isArray(payload) ? payload : [payload];
      items.forEach((item) => {
        const normalizedBid = normalizeRideBidEvent(item);
        if (!normalizedBid) {
          console.log('[RideBidSocket] received-bids could not normalize item:', item);
          return;
        }

        if (normalizedBid.rideRequestId && normalizedBid.rideRequestId !== resolvedRideRequestId) {
          console.log('[RideBidSocket] received-bids ignored for different ride request:', {
            expectedRideRequestId: resolvedRideRequestId,
            incomingRideRequestId: normalizedBid.rideRequestId,
            bid: normalizedBid.bid,
          });
          return;
        }

        console.log('[RideBidSocket] received-bids accepted bid:', {
          rideRequestId: resolvedRideRequestId,
          bid: normalizedBid.bid,
        });
        addBid(normalizedBid.bid);
      });
    },
    { enabled: isEnabled },
  );

  useSocketEvent<[RideSharingServerEventMap['ride:bid:new']]>(
    'ride:bid:new',
    (payload) => {
      if (!isEnabled || !resolvedRideRequestId || payload.rideRequestId !== resolvedRideRequestId) {
        console.log('[RideBidSocket] ride:bid:new ignored:', {
          isEnabled,
          expectedRideRequestId: resolvedRideRequestId,
          incomingRideRequestId: payload.rideRequestId,
          payload,
        });
        return;
      }

      console.log('[RideBidSocket] ride:bid:new accepted:', payload);
      addBid(payload.bid);
    },
    { enabled: isEnabled },
  );

  useSocketEvent<[RideSharingServerEventMap['ride:bid:removed']]>(
    'ride:bid:removed',
    (payload) => {
      if (!isEnabled || !resolvedRideRequestId || payload.rideRequestId !== resolvedRideRequestId) {
        console.log('[RideBidSocket] ride:bid:removed ignored:', {
          isEnabled,
          expectedRideRequestId: resolvedRideRequestId,
          incomingRideRequestId: payload.rideRequestId,
          payload,
        });
        return;
      }

      console.log('[RideBidSocket] ride:bid:removed accepted:', payload);
      removeBid(payload.bidId);
    },
    { enabled: isEnabled },
  );
}
