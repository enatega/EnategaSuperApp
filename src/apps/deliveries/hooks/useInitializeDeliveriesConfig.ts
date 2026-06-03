import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { deliveryKeys } from '../api/queryKeys';
import {
  platformConfigurationService,
  type DeliveriesPlatformConfigurationResponse,
} from '../api/platformConfigurationService';
import { ApiError } from '../../../general/api/apiClient';
import {
  mapPlatformTypeToDeliveryMode,
  useAppConfigStore,
  type AppCurrency,
  type DeliveriesAppSettings,
  type DeliveriesPlatformConfiguration,
} from '../../../general/stores/useAppConfigStore';

type DeliveriesBootstrapConfig = {
  platformConfiguration: DeliveriesPlatformConfiguration;
  appSettings: DeliveriesAppSettings | null;
  currency: AppCurrency | null;
};

function toPlatformConfiguration(
  response: DeliveriesPlatformConfigurationResponse,
): DeliveriesPlatformConfiguration {
  return {
    id: response.id,
    platform_type: response.platform_type,
    created_at: response.created_at,
    updated_at: response.updated_at,
  };
}

function toDeliveriesAppSettings(
  response: DeliveriesPlatformConfigurationResponse,
): DeliveriesAppSettings | null {
  if (response.app_settings) {
    return response.app_settings;
  }

  const hasTopLevelSettings =
    typeof response.is_maintenance_mode === 'boolean' ||
    typeof response.maintenance_message === 'string' ||
    typeof response.promotional_banner === 'string' ||
    response.primary_color != null ||
    response.secondary_color != null ||
    response.tertiary_color != null;

  if (!hasTopLevelSettings) {
    return null;
  }

  return {
    is_maintenance_mode: response.is_maintenance_mode ?? false,
    maintenance_message: response.maintenance_message ?? null,
    promotional_banner: response.promotional_banner ?? null,
    primary_color: response.primary_color ?? null,
    secondary_color: response.secondary_color ?? null,
    tertiary_color: response.tertiary_color ?? null,
  };
}

export function useInitializeDeliveriesConfig() {
  const {
    deliveries,
    setDeliveriesPlatformConfiguration,
    setDeliveriesAppSettings,
    setDeliveriesDeliveryMode,
    setDeliveriesCurrency,
    setDeliveriesConfigLoading,
    setDeliveriesConfigError,
    markDeliveriesConfigLoaded,
  } = useAppConfigStore();

  const platformConfigurationQuery = useQuery<DeliveriesBootstrapConfig, ApiError>({
    queryKey: deliveryKeys.appConfig(),
    queryFn: async () => {
      const [platformConfigurationResponse, currencies] = await Promise.all([
        platformConfigurationService.getPlatformConfiguration(),
        platformConfigurationService.getCurrencies(),
      ]);

      const activeCurrency =
        currencies.find((currency) => currency.isActive) ?? currencies[0] ?? null;
      console.log('[deliveries][currency] selected-for-app', {
        activeCurrency,
        availableCurrencyCodes: currencies.map((currency) => currency.code),
      });

      return {
        platformConfiguration: toPlatformConfiguration(platformConfigurationResponse),
        appSettings: toDeliveriesAppSettings(platformConfigurationResponse),
        currency: activeCurrency,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !deliveries.isLoaded,
  });

  useEffect(() => {
    setDeliveriesConfigLoading(
      platformConfigurationQuery.isLoading || platformConfigurationQuery.isFetching,
    );
  }, [
    platformConfigurationQuery.isFetching,
    platformConfigurationQuery.isLoading,
    setDeliveriesConfigLoading,
  ]);

  useEffect(() => {
    if (!platformConfigurationQuery.data) {
      return;
    }

    setDeliveriesPlatformConfiguration(platformConfigurationQuery.data.platformConfiguration);
    setDeliveriesAppSettings(platformConfigurationQuery.data.appSettings);
    setDeliveriesDeliveryMode(
      mapPlatformTypeToDeliveryMode(
        platformConfigurationQuery.data.platformConfiguration.platform_type,
      ),
    );
    setDeliveriesCurrency(platformConfigurationQuery.data.currency);
    markDeliveriesConfigLoaded();
    setDeliveriesConfigError(null);
  }, [
    markDeliveriesConfigLoaded,
    platformConfigurationQuery.data,
    setDeliveriesConfigError,
    setDeliveriesAppSettings,
    setDeliveriesCurrency,
    setDeliveriesDeliveryMode,
    setDeliveriesPlatformConfiguration,
  ]);

  useEffect(() => {
    if (!platformConfigurationQuery.error) {
      return;
    }

    const fallbackDeliveryMode = mapPlatformTypeToDeliveryMode('MULTI_VENDOR');
    const errorMessage =
      platformConfigurationQuery.error instanceof ApiError
        ? platformConfigurationQuery.error.message
        : 'Failed to load deliveries configuration';

    setDeliveriesConfigError(errorMessage);
    setDeliveriesAppSettings(null);
    setDeliveriesDeliveryMode(fallbackDeliveryMode);
    markDeliveriesConfigLoaded();
  }, [
    markDeliveriesConfigLoaded,
    platformConfigurationQuery.error,
    setDeliveriesConfigError,
    setDeliveriesAppSettings,
    setDeliveriesDeliveryMode,
  ]);

  return platformConfigurationQuery;
}
