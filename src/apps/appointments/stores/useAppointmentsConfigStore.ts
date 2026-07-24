import { create } from 'zustand';
import type { AppointmentsPlatformConfiguration } from '../api/platformConfigurationService';

export type AppointmentsMode = 'singleVendor' | 'multiVendor' | 'chain';

type AppointmentsConfigState = {
  configuration: AppointmentsPlatformConfiguration | null;
  mode: AppointmentsMode | null;
  isLoaded: boolean;
  error: string | null;
  setConfiguration: (
    configuration: AppointmentsPlatformConfiguration,
  ) => void;
  setMode: (mode: AppointmentsMode) => void;
  setError: (error: string | null) => void;
};

export function mapAppointmentPlatformTypeToMode(
  platformType: AppointmentsPlatformConfiguration['platform_type'],
): AppointmentsMode {
  switch (platformType) {
    case 'SINGLE_VENDOR':
      return 'singleVendor';
    case 'STORE_CHAIN':
      return 'chain';
    case 'MULTI_VENDOR':
    default:
      return 'multiVendor';
  }
}

export const useAppointmentsConfigStore = create<AppointmentsConfigState>(
  (set) => ({
    configuration: null,
    mode: null,
    isLoaded: false,
    error: null,
    setConfiguration: (configuration) =>
      set({
        configuration,
        mode: mapAppointmentPlatformTypeToMode(configuration.platform_type),
        isLoaded: true,
        error: null,
      }),
    setMode: (mode) => set({ mode }),
    setError: (error) =>
      set((state) => ({
        error,
        isLoaded: true,
        mode: state.mode ?? 'multiVendor',
      })),
  }),
);
