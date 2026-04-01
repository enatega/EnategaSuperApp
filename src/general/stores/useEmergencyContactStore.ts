import { create } from 'zustand';
import type { GlobalEmergencyContact } from '../api/emergencyContactService';

type EmergencyContactState = {
  contact: GlobalEmergencyContact | null;
  isLoading: boolean;
  error: string | null;
  setContact: (contact: GlobalEmergencyContact) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useEmergencyContactStore = create<EmergencyContactState>((set) => ({
  contact: null,
  isLoading: false,
  error: null,
  setContact: (contact) => set({ contact, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
