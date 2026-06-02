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
    console.log('[deliveries][currency] request', {
      path: DELIVERIES_CURRENCY_PATH,
    });
    const response = await apiClient.get<AppCurrency[] | AppCurrency>(
      DELIVERIES_CURRENCY_PATH,
    );
    console.log('[deliveries][currency] response-raw', response);

    if (Array.isArray(response)) {
      console.log('[deliveries][currency] response-normalized', {
        count: response.length,
        codes: response.map((currency) => currency.code),
      });
      return response;
    }

    if (response && typeof response === 'object') {
      console.log('[deliveries][currency] response-normalized', {
        count: 1,
        codes: [response.code],
      });
      return [response];
    }

    console.log('[deliveries][currency] response-normalized', {
      count: 0,
      codes: [],
    });
    return [];
  },
};
