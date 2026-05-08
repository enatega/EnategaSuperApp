import { create } from 'zustand';
import type { ActiveRidePayload } from '../api/types';

function readRideId(ride: ActiveRidePayload | null | undefined) {
  return ride?.ride_id?.trim() || '';
}

type ActiveRideState = {
  activeRide: ActiveRidePayload | null;
  suppressedRideId: string | null;
  suppressActiveRideUntil: number;
  setActiveRide: (ride: ActiveRidePayload | null) => void;
  suppressRideById: (rideId: string, durationMs?: number) => void;
  clearActiveRide: () => void;
};

export const useActiveRideStore = create<ActiveRideState>((set) => ({
  activeRide: null,
  suppressedRideId: null,
  suppressActiveRideUntil: 0,
  setActiveRide: (ride) =>
    set((state) => {
      if (!ride) {
        return { activeRide: null };
      }

      const nextRideId = readRideId(ride);
      const now = Date.now();
      const isSuppressedRide = Boolean(
        state.suppressedRideId
        && nextRideId
        && state.suppressedRideId === nextRideId
        && now < state.suppressActiveRideUntil,
      );

      if (isSuppressedRide) {
        return state;
      }

      return {
        activeRide: ride,
        ...(state.suppressedRideId && now >= state.suppressActiveRideUntil
          ? { suppressedRideId: null, suppressActiveRideUntil: 0 }
          : null),
      };
    }),
  suppressRideById: (rideId, durationMs = 20_000) =>
    set((state) => {
      const normalizedRideId = rideId.trim();
      if (!normalizedRideId) {
        return state;
      }

      return {
        suppressedRideId: normalizedRideId,
        suppressActiveRideUntil: Date.now() + durationMs,
      };
    }),
  clearActiveRide: () => set({ activeRide: null }),
}));
