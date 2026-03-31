import { create } from 'zustand';
import { rideService } from '../api/rideService';
import type { FindingRideBid } from '../screens/findingRide/types/bids';

const BID_VALIDITY_MS = 15_000;
const BID_TICK_INTERVAL_MS = 250;
let expirationTicker: ReturnType<typeof setInterval> | null = null;
const pendingExpiryDeclines = new Set<string>();

function getUniqueBids(bids: FindingRideBid[]) {
  const seenBidIds = new Set<string>();

  return bids.filter((bid) => {
    if (seenBidIds.has(bid.id)) {
      return false;
    }

    seenBidIds.add(bid.id);
    return true;
  });
}

function createClientDrivenExpiry() {
  return new Date(Date.now() + BID_VALIDITY_MS).toISOString();
}

function isExpired(expiresAt: string | undefined) {
  if (!expiresAt) {
    return false;
  }

  const expiresAtMs = Date.parse(expiresAt);
  return !Number.isNaN(expiresAtMs) && expiresAtMs <= Date.now();
}

function getRemainingTimeMs(expiresAt: string | undefined) {
  if (!expiresAt) {
    return BID_VALIDITY_MS;
  }

  const expiresAtMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtMs)) {
    return BID_VALIDITY_MS;
  }

  return Math.max(expiresAtMs - Date.now(), 0);
}

function mergeBidWithExpiry(nextBid: FindingRideBid, existingBid?: FindingRideBid) {
  const expiresAt = existingBid?.expiresAt ?? nextBid.expiresAt ?? createClientDrivenExpiry();

  return {
    ...nextBid,
    expiresAt,
    remainingTimeMs: getRemainingTimeMs(expiresAt),
  };
}

type RideBidsState = {
  currentRideRequestId?: string;
  bids: FindingRideBid[];
  syncRideRequest: (rideRequestId?: string) => void;
  setBids: (bids: FindingRideBid[]) => void;
  addBid: (bid: FindingRideBid) => void;
  removeBid: (bidId: string) => void;
  clearBids: () => void;
};

export const useRideBidsStore = create<RideBidsState>((set, get) => {
  const ensureExpirationTicker = () => {
    if (expirationTicker) {
      return;
    }

    expirationTicker = setInterval(() => {
      const { bids, removeBid } = get();

      if (!bids.length) {
        if (expirationTicker) {
          clearInterval(expirationTicker);
          expirationTicker = null;
        }
        return;
      }

      set((state) => ({
        bids: state.bids.map((bid) => ({
          ...bid,
          remainingTimeMs: getRemainingTimeMs(bid.expiresAt),
        })),
      }));

      bids.forEach((bid) => {
        if (!isExpired(bid.expiresAt) || pendingExpiryDeclines.has(bid.id)) {
          return;
        }

        pendingExpiryDeclines.add(bid.id);

        void rideService.rejectRideBid({ rideBidId: bid.id })
          .catch((error) => {
            console.warn('[RideBidsStore] Failed to auto-decline expired bid', {
              bidId: bid.id,
              error: error instanceof Error ? error.message : String(error),
            });
          })
          .finally(() => {
            pendingExpiryDeclines.delete(bid.id);
            removeBid(bid.id);
          });
      });
    }, BID_TICK_INTERVAL_MS);
  };

  const stopExpirationTickerIfIdle = () => {
    if (expirationTicker && get().bids.length === 0) {
      clearInterval(expirationTicker);
      expirationTicker = null;
    }
  };

  return {
    currentRideRequestId: undefined,
    bids: [],
    syncRideRequest: (rideRequestId) => set((state) => {
      if (!rideRequestId) {
        return {
          currentRideRequestId: undefined,
          bids: [],
        };
      }

      if (state.currentRideRequestId === rideRequestId) {
        return state;
      }

      return {
        currentRideRequestId: rideRequestId,
        bids: [],
      };
    }),
    setBids: (bids) => set((state) => {
      const existingBidsById = new Map(state.bids.map((bid) => [bid.id, bid]));
      const nextBids = getUniqueBids(
        bids.map((bid) => mergeBidWithExpiry(bid, existingBidsById.get(bid.id))),
      );

      ensureExpirationTicker();

      return { bids: nextBids };
    }),
    addBid: (bid) => set((state) => {
      ensureExpirationTicker();

      const existingBid = state.bids.find((item) => item.id === bid.id);
      const nextBid = mergeBidWithExpiry(bid, existingBid);

      return {
        bids: [nextBid, ...state.bids.filter((item) => item.id !== bid.id)],
      };
    }),
    removeBid: (bidId) => set((state) => {
      const nextState = {
        bids: state.bids.filter((item) => item.id !== bidId),
      };

      if (expirationTicker && nextState.bids.length === 0) {
        clearInterval(expirationTicker);
        expirationTicker = null;
      }

      return nextState;
    }),
    clearBids: () => {
      pendingExpiryDeclines.clear();
      set({
        bids: [],
        currentRideRequestId: undefined,
      });
      stopExpirationTickerIfIdle();
    },
  };
});
