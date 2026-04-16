import apiClient from '../../../general/api/apiClient';
import type {
  AppCurrency,
  DeliveriesPlatformConfiguration,
} from '../../../general/stores/useAppConfigStore';

const DELIVERIES_PLATFORM_CONFIGURATION_PATH =
  '/api/v1/apps/deliveries/platform-configuration';
const DELIVERIES_CURRENCY_PATH = '/api/v1/apps/deliveries/currency';

export const platformConfigurationService = {
  getPlatformConfiguration: () =>
    apiClient.get<DeliveriesPlatformConfiguration>(
      DELIVERIES_PLATFORM_CONFIGURATION_PATH,
    ),

  getCurrencies: async (): Promise<AppCurrency[]> => {
    const response = await apiClient.get<AppCurrency[]>(DELIVERIES_CURRENCY_PATH);
    return Array.isArray(response) ? response : [];
  },
};
