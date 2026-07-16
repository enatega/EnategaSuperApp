import { useEffect, useState } from 'react';
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
import {
  getStoredDeliveriesBootstrapConfig,
  setStoredDeliveriesBootstrapConfig,
  type DeliveriesBootstrapConfigCache,
} from '../storage/deliveriesBootstrapConfigStorage';
import { getDeliveryModePreference } from '../navigation/deliveryModePreference';
import { isDeliveriesDemoModeEnabled } from '../navigation/deliveryDemoMode';

type DeliveriesBootstrapConfig = DeliveriesBootstrapConfigCache;

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
    response.primary_color != null ||
    response.secondary_color != null ||
    response.tertiary_color != null;

  if (!hasTopLevelSettings) {
    return null;
  }

  return {
    is_maintenance_mode: response.is_maintenance_mode ?? false,
    maintenance_message: response.maintenance_message ?? null,
    primary_color: response.primary_color ?? null,
    secondary_color: response.secondary_color ?? null,
    tertiary_color: response.tertiary_color ?? null,
  };
}

export function useInitializeDeliveriesConfig() {
  const isDemoModeEnabled = isDeliveriesDemoModeEnabled();
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
  const [isHydratingCache, setIsHydratingCache] = useState(true);
  const [hasCachedConfig, setHasCachedConfig] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateStoredConfig() {
      try {
        const storedConfig = await getStoredDeliveriesBootstrapConfig();

        if (!isMounted || !storedConfig) {
          return;
        }

        setDeliveriesPlatformConfiguration(storedConfig.platformConfiguration);
        setDeliveriesAppSettings(storedConfig.appSettings);
        if (isDemoModeEnabled) {
          setDeliveriesDeliveryMode(await getDeliveryModePreference());
        } else {
          setDeliveriesDeliveryMode(
            mapPlatformTypeToDeliveryMode(
              storedConfig.platformConfiguration.platform_type,
            ),
          );
        }
        setDeliveriesCurrency(storedConfig.currency);
        markDeliveriesConfigLoaded();
        setDeliveriesConfigError(null);
        setHasCachedConfig(true);
      } finally {
        if (isMounted) {
          setIsHydratingCache(false);
        }
      }
    }

    hydrateStoredConfig();

    return () => {
      isMounted = false;
    };
  }, [
    markDeliveriesConfigLoaded,
    setDeliveriesAppSettings,
    setDeliveriesConfigError,
    setDeliveriesCurrency,
    setDeliveriesDeliveryMode,
    setDeliveriesPlatformConfiguration,
    isDemoModeEnabled,
  ]);

  const platformConfigurationQuery = useQuery<DeliveriesBootstrapConfig, ApiError>({
    queryKey: deliveryKeys.appConfig(),
    queryFn: async () => {
      const [platformConfigurationResponse, currencies] = await Promise.all([
        platformConfigurationService.getPlatformConfiguration(),
        platformConfigurationService.getCurrencies(),
      ]);

      const activeCurrency =
        currencies.find((currency) => currency.isActive) ?? currencies[0] ?? null;

      return {
        platformConfiguration: toPlatformConfiguration(platformConfigurationResponse),
        appSettings: toDeliveriesAppSettings(platformConfigurationResponse),
        currency: activeCurrency,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const shouldShowLoadingState =
      !hasCachedConfig &&
      !deliveries.platformConfiguration &&
      !deliveries.deliveryMode &&
      !isHydratingCache &&
      (platformConfigurationQuery.isLoading || platformConfigurationQuery.isFetching);

    setDeliveriesConfigLoading(shouldShowLoadingState);
  }, [
    deliveries.deliveryMode,
    deliveries.platformConfiguration,
    hasCachedConfig,
    isHydratingCache,
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
    setDeliveriesCurrency(platformConfigurationQuery.data.currency);
    const finalize = async () => {
      if (isDemoModeEnabled) {
        setDeliveriesDeliveryMode(await getDeliveryModePreference());
      } else {
        setDeliveriesDeliveryMode(
          mapPlatformTypeToDeliveryMode(
            platformConfigurationQuery.data.platformConfiguration.platform_type,
          ),
        );
      }

      markDeliveriesConfigLoaded();
      setDeliveriesConfigError(null);
      setHasCachedConfig(true);
      await setStoredDeliveriesBootstrapConfig(platformConfigurationQuery.data);
    };

    void finalize();
  }, [
    isDemoModeEnabled,
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

    const errorMessage =
      platformConfigurationQuery.error instanceof ApiError
        ? platformConfigurationQuery.error.message
        : 'Failed to load deliveries configuration';

    setDeliveriesConfigError(errorMessage);

    if (deliveries.platformConfiguration && deliveries.deliveryMode) {
      markDeliveriesConfigLoaded();
      return;
    }

    const finalizeErrorState = async () => {
      setDeliveriesAppSettings(null);

      if (isDemoModeEnabled) {
        setDeliveriesDeliveryMode(await getDeliveryModePreference());
      } else {
        setDeliveriesDeliveryMode(mapPlatformTypeToDeliveryMode('MULTI_VENDOR'));
      }

      markDeliveriesConfigLoaded();
    };

    void finalizeErrorState();
  }, [
    deliveries.deliveryMode,
    deliveries.platformConfiguration,
    isDemoModeEnabled,
    markDeliveriesConfigLoaded,
    platformConfigurationQuery.error,
    setDeliveriesConfigError,
    setDeliveriesAppSettings,
    setDeliveriesDeliveryMode,
  ]);

  return {
    ...platformConfigurationQuery,
    hasCachedConfig,
    isHydratingCache,
  };
}
