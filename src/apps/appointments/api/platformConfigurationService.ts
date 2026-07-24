import apiClient from '../../../general/api/apiClient';

export type AppointmentPlatformType =
  | 'SINGLE_VENDOR'
  | 'MULTI_VENDOR'
  | 'STORE_CHAIN';

export type AppointmentsPlatformConfiguration = {
  id: string;
  platform_type: AppointmentPlatformType;
  single_vendor_store_id: string | null;
  chain_id: string | null;
};

const PLATFORM_CONFIGURATION_PATH =
  '/api/v1/apps/general-bookings/platform-configuration';

export const appointmentsPlatformConfigurationService = {
  get: () =>
    apiClient.get<AppointmentsPlatformConfiguration>(
      PLATFORM_CONFIGURATION_PATH,
    ),
};
