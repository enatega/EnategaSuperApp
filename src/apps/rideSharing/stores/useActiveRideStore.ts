import { create } from 'zustand';

type ActiveRideState = {
  activeRide: unknown | null;
  hasBootstrapped: boolean;
  isBootstrapping: boolean;
  setActiveRide: (ride: unknown | null) => void;
  clearActiveRide: () => void;
  startBootstrapping: () => void;
  finishBootstrapping: () => void;
};

export const useActiveRideStore = create<ActiveRideState>((set) => ({
  activeRide: null,
  hasBootstrapped: false,
  isBootstrapping: false,
  setActiveRide: (ride) => set({ activeRide: ride }),
  clearActiveRide: () => set({ activeRide: null }),
  startBootstrapping: () => set({ isBootstrapping: true }),
  finishBootstrapping: () => set({ isBootstrapping: false, hasBootstrapped: true }),
}));
