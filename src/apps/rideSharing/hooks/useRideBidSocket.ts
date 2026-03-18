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
  const addBid = useRideBidsStore((state) => state.addBid);
  const removeBid = useRideBidsStore((state) => state.removeBid);
  const clearBids = useRideBidsStore((state) => state.clearBids);

  useEffect(() => {
    clearBids();
  }, [clearBids, resolvedRideRequestId]);

  useEffect(() => {
    if (!isEnabled) {
      clearBids();
    }
  }, [clearBids, isEnabled]);

  useSocketEvent<[RideSharingServerEventMap['received-bids']]>(
    'received-bids',
    (payload) => {
      if (!isEnabled || !resolvedRideRequestId) {
        return;
      }

      const items = Array.isArray(payload) ? payload : [payload];
      items.forEach((item) => {
        const normalizedBid = normalizeRideBidEvent(item);
        if (!normalizedBid) {
          return;
        }

        if (normalizedBid.rideRequestId && normalizedBid.rideRequestId !== resolvedRideRequestId) {
          return;
        }

        addBid(normalizedBid.bid);
      });
    },
    { enabled: isEnabled },
  );

  useSocketEvent<[RideSharingServerEventMap['ride:bid:new']]>(
    'ride:bid:new',
    (payload) => {
      if (!isEnabled || !resolvedRideRequestId || payload.rideRequestId !== resolvedRideRequestId) {
        return;
      }

      addBid(payload.bid);
    },
    { enabled: isEnabled },
  );

  useSocketEvent<[RideSharingServerEventMap['ride:bid:removed']]>(
    'ride:bid:removed',
    (payload) => {
      if (!isEnabled || !resolvedRideRequestId || payload.rideRequestId !== resolvedRideRequestId) {
        return;
      }

      removeBid(payload.bidId);
    },
    { enabled: isEnabled },
  );
}
