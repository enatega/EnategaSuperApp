import { create } from 'zustand';
import type { FindingRideBid } from '../screens/findingRide/types/bids';

type RideBidsState = {
  bids: FindingRideBid[];
  setBids: (bids: FindingRideBid[]) => void;
  addBid: (bid: FindingRideBid) => void;
  removeBid: (bidId: string) => void;
  clearBids: () => void;
};

export const useRideBidsStore = create<RideBidsState>((set) => ({
  bids: [],
  setBids: (bids) => set({ bids }),
  addBid: (bid) => set((state) => ({ bids: [bid, ...state.bids.filter((item) => item.id !== bid.id)] })),
  removeBid: (bidId) => set((state) => ({ bids: state.bids.filter((item) => item.id !== bidId) })),
  clearBids: () => set({ bids: [] }),
}));
