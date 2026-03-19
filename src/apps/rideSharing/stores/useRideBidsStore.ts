import { create } from 'zustand';
import type { FindingRideBid } from '../screens/findingRide/types/bids';

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

type RideBidsState = {
  bids: FindingRideBid[];
  setBids: (bids: FindingRideBid[]) => void;
  addBid: (bid: FindingRideBid) => void;
  removeBid: (bidId: string) => void;
  clearBids: () => void;
};

export const useRideBidsStore = create<RideBidsState>((set) => ({
  bids: [],
  setBids: (bids) => set({ bids: getUniqueBids(bids) }),
  addBid: (bid) => set((state) => ({ bids: [bid, ...state.bids.filter((item) => item.id !== bid.id)] })),
  removeBid: (bidId) => set((state) => ({ bids: state.bids.filter((item) => item.id !== bidId) })),
  clearBids: () => set({ bids: [] }),
}));
