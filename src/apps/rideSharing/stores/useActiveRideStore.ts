import { create } from 'zustand';
import type { ActiveRidePayload } from '../api/types';

type ActiveRideState = {
  activeRide: ActiveRidePayload | null;
  setActiveRide: (ride: ActiveRidePayload | null) => void;
  clearActiveRide: () => void;
};

export const useActiveRideStore = create<ActiveRideState>((set) => ({
  activeRide: null,
  setActiveRide: (ride) => set({ activeRide: ride }),
  clearActiveRide: () => set({ activeRide: null }),
}));
