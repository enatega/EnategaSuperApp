import { useEffect } from 'react';
import { useSocketEvent } from '../../../general/hooks/useSocketEvent';
import { useActiveRideRequestStore } from '../stores/useActiveRideRequestStore';
import { useRideBidsStore } from '../stores/useRideBidsStore';
import type { RideSharingServerEventMap } from '../socket/rideSharingSocket.types';

export function useRideBidSocket() {
  const activeRideRequestId = useActiveRideRequestStore(
    (state) => state.activeRideRequest?.id,
  );
  const addBid = useRideBidsStore((state) => state.addBid);
  const removeBid = useRideBidsStore((state) => state.removeBid);
  const clearBids = useRideBidsStore((state) => state.clearBids);

  useEffect(() => {
    if (!activeRideRequestId) {
      clearBids();
    }
  }, [activeRideRequestId, clearBids]);

  useSocketEvent<[RideSharingServerEventMap['ride:bid:new']]>(
    'ride:bid:new',
    (payload) => {
      if (!activeRideRequestId || payload.rideRequestId !== activeRideRequestId) {
        return;
      }

      addBid(payload.bid);
    },
  );

  useSocketEvent<[RideSharingServerEventMap['ride:bid:removed']]>(
    'ride:bid:removed',
    (payload) => {
      if (!activeRideRequestId || payload.rideRequestId !== activeRideRequestId) {
        return;
      }

      removeBid(payload.bidId);
    },
  );
}
