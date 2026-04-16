import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { deliveryKeys } from '../api/queryKeys';
import { platformConfigurationService } from '../api/platformConfigurationService';
import { ApiError } from '../../../general/api/apiClient';
import {
  mapPlatformTypeToDeliveryMode,
  useAppConfigStore,
  type AppCurrency,
  type DeliveriesPlatformConfiguration,
} from '../../../general/stores/useAppConfigStore';

type DeliveriesBootstrapConfig = {
  platformConfiguration: DeliveriesPlatformConfiguration;
  currency: AppCurrency | null;
};

export function useInitializeDeliveriesConfig() {
  const {
    deliveries,
    setDeliveriesPlatformConfiguration,
    setDeliveriesDeliveryMode,
    setDeliveriesCurrency,
    setDeliveriesConfigLoading,
    setDeliveriesConfigError,
    markDeliveriesConfigLoaded,
  } = useAppConfigStore();

  const platformConfigurationQuery = useQuery<DeliveriesBootstrapConfig, ApiError>({
    queryKey: deliveryKeys.appConfig(),
    queryFn: async () => {
      const [platformConfiguration, currencies] = await Promise.all([
        platformConfigurationService.getPlatformConfiguration(),
        platformConfigurationService.getCurrencies(),
      ]);

      const activeCurrency =
        currencies.find((currency) => currency.isActive) ?? currencies[0] ?? null;

      return {
        platformConfiguration,
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
    setDeliveriesDeliveryMode(fallbackDeliveryMode);
    markDeliveriesConfigLoaded();
  }, [
    markDeliveriesConfigLoaded,
    platformConfigurationQuery.error,
    setDeliveriesConfigError,
    setDeliveriesDeliveryMode,
  ]);

  return platformConfigurationQuery;
}
