import apiClient from '../../../general/api/apiClient';
import type {
  AppCurrency,
  DeliveriesAppSettings,
  DeliveriesPlatformConfiguration,
} from '../../../general/stores/useAppConfigStore';

const DELIVERIES_PLATFORM_CONFIGURATION_PATH =
  '/api/v1/apps/deliveries/platform-configuration';
const DELIVERIES_CURRENCY_PATH = '/api/v1/apps/deliveries/currency';

export type DeliveriesPlatformConfigurationResponse =
  DeliveriesPlatformConfiguration & {
    app_settings?: DeliveriesAppSettings | null;
    is_maintenance_mode?: boolean;
    maintenance_message?: string | null;
    primary_color?: string | null;
    secondary_color?: string | null;
    tertiary_color?: string | null;
  };

export const platformConfigurationService = {
  getPlatformConfiguration: () =>
    apiClient.get<DeliveriesPlatformConfigurationResponse>(
      DELIVERIES_PLATFORM_CONFIGURATION_PATH,
    ),

  getCurrencies: async (): Promise<AppCurrency[]> => {
    const response = await apiClient.get<AppCurrency[] | AppCurrency>(
      DELIVERIES_CURRENCY_PATH,
    );

    if (Array.isArray(response)) {
      return response;
    }

    if (response && typeof response === 'object') {
      return [response];
    }

    return [];
  },
};
