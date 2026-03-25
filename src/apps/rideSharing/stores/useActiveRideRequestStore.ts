import { create } from 'zustand';
import type { ActiveRideRequestPayload } from '../api/types';

type ActiveRideRequestState = {
  activeRideRequest: ActiveRideRequestPayload | null;
  setActiveRideRequest: (request: ActiveRideRequestPayload | null) => void;
  clearActiveRideRequest: () => void;
};

export const useActiveRideRequestStore = create<ActiveRideRequestState>((set) => ({
  activeRideRequest: null,
  setActiveRideRequest: (request) => set({ activeRideRequest: request }),
  clearActiveRideRequest: () => set({ activeRideRequest: null }),
}));
