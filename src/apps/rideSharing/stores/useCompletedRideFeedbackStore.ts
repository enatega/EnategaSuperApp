import { create } from 'zustand';
import type { CompletedRideFeedbackData } from '../screens/activeRide/types/view';

type CompletedRideFeedbackState = {
  feedbackRide: CompletedRideFeedbackData | null;
  setFeedbackRide: (ride: CompletedRideFeedbackData) => void;
  clearFeedbackRide: () => void;
};

export const useCompletedRideFeedbackStore = create<CompletedRideFeedbackState>((set) => ({
  feedbackRide: null,
  setFeedbackRide: (ride) => set({ feedbackRide: ride }),
  clearFeedbackRide: () => set({ feedbackRide: null }),
}));
