import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { deliveryKeys } from '../api/queryKeys';
import {
  platformConfigurationService,
  type DeliveriesAppSettingsResponse,
  type DeliveriesPlatformConfigurationResponse,
} from '../api/platformConfigurationService';
import { ApiError } from '../../../general/api/apiClient';
import { useAuthSessionQuery } from '../../../general/hooks/useAuthQueries';
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

type DeliveriesBootstrapConfig = DeliveriesBootstrapConfigCache;
const FOREGROUND_REFETCH_MIN_INTERVAL_MS = 60 * 1000;

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
  response:
    | DeliveriesPlatformConfigurationResponse
    | DeliveriesAppSettingsResponse,
): DeliveriesAppSettings | null {
  if ('app_settings' in response && response.app_settings) {
    return response.app_settings;
  }

  const hasTopLevelSettings =
    typeof response.is_maintenance_mode === 'boolean' ||
    typeof response.maintenance_message === 'string' ||
    response.primary_color != null ||
    response.secondary_color != null ||
    response.tertiary_color != null ||
    response.button_text_color != null;

  if (!hasTopLevelSettings) {
    return null;
  }

  return {
    is_maintenance_mode: response.is_maintenance_mode ?? false,
    maintenance_message: response.maintenance_message ?? null,
    primary_color: response.primary_color ?? null,
    secondary_color: response.secondary_color ?? null,
    tertiary_color: response.tertiary_color ?? null,
    button_text_color: response.button_text_color ?? null,
  };
}

function areBootstrapConfigsEqual(
  left: DeliveriesBootstrapConfig | null,
  right: DeliveriesBootstrapConfig | null,
) {
  if (!left || !right) {
    return left === right;
  }

  return JSON.stringify(left) === JSON.stringify(right);
}

export function useInitializeDeliveriesConfig() {
  const authSessionQuery = useAuthSessionQuery();
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
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastForegroundRefetchAtRef = useRef(0);
  const hasAccessToken = Boolean(authSessionQuery.data?.token);

  useEffect(() => {
    let isMounted = true;

    async function hydrateStoredConfig() {
      try {
        const storedConfig = await getStoredDeliveriesBootstrapConfig();

        if (__DEV__) {
          console.log('[DeliveriesConfig] Hydrated cached config', storedConfig);
        }

        if (!isMounted || !storedConfig) {
          return;
        }

        setDeliveriesPlatformConfiguration(storedConfig.platformConfiguration);
        setDeliveriesAppSettings(storedConfig.appSettings);
        setDeliveriesDeliveryMode(
          mapPlatformTypeToDeliveryMode(
            storedConfig.platformConfiguration.platform_type,
          ),
        );
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
  ]);

  const platformConfigurationQuery = useQuery<DeliveriesBootstrapConfig, ApiError>({
    queryKey: deliveryKeys.appConfig(),
    enabled: hasAccessToken,
    queryFn: async () => {
      const [platformConfigurationResponse, appSettingsResponse, currencies] =
        await Promise.all([
          platformConfigurationService.getPlatformConfiguration(),
          platformConfigurationService.getAppSettings(),
          platformConfigurationService.getCurrencies(),
        ]);

      if (__DEV__) {
        console.log('[DeliveriesConfig] Platform configuration response', platformConfigurationResponse);
        console.log('[DeliveriesConfig] App settings response', appSettingsResponse);
        console.log('[DeliveriesConfig] Currencies response', currencies);
      }

      const activeCurrency =
        currencies.find((currency) => currency.isActive) ?? currencies[0] ?? null;

      return {
        platformConfiguration: toPlatformConfiguration(platformConfigurationResponse),
        appSettings:
          toDeliveriesAppSettings(appSettingsResponse) ??
          toDeliveriesAppSettings(platformConfigurationResponse),
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
    if (!hasAccessToken) {
      if (__DEV__) {
        console.log('[DeliveriesConfig] Skipping remote config bootstrap because no auth token is available');
      }

      setDeliveriesConfigLoading(false);
      setDeliveriesConfigError(null);

      if (deliveries.platformConfiguration && deliveries.deliveryMode) {
        markDeliveriesConfigLoaded();
        return;
      }

      setDeliveriesAppSettings(null);
      setDeliveriesDeliveryMode(mapPlatformTypeToDeliveryMode('MULTI_VENDOR'));
      markDeliveriesConfigLoaded();
      return;
    }

    const shouldShowLoadingState =
      !hasCachedConfig &&
      !deliveries.platformConfiguration &&
      !deliveries.deliveryMode &&
      !isHydratingCache &&
      (platformConfigurationQuery.isLoading || platformConfigurationQuery.isFetching);

    setDeliveriesConfigLoading(shouldShowLoadingState);
  }, [
    hasAccessToken,
    deliveries.appSettings,
    deliveries.deliveryMode,
    deliveries.platformConfiguration,
    hasCachedConfig,
    isHydratingCache,
    markDeliveriesConfigLoaded,
    platformConfigurationQuery.isFetching,
    platformConfigurationQuery.isLoading,
    setDeliveriesAppSettings,
    setDeliveriesConfigError,
    setDeliveriesConfigLoading,
    setDeliveriesDeliveryMode,
  ]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const wasBackgrounded =
        appStateRef.current === 'background' || appStateRef.current === 'inactive';

      appStateRef.current = nextAppState;

      if (!wasBackgrounded || nextAppState !== 'active') {
        return;
      }

      if (!hasAccessToken) {
        if (__DEV__) {
          console.log('[DeliveriesConfig] Skipping foreground refetch because user is logged out');
        }
        return;
      }

      const now = Date.now();
      if (now - lastForegroundRefetchAtRef.current < FOREGROUND_REFETCH_MIN_INTERVAL_MS) {
        if (__DEV__) {
          console.log('[DeliveriesConfig] Skipping foreground refetch due to cooldown');
        }
        return;
      }

      lastForegroundRefetchAtRef.current = now;

      if (__DEV__) {
        console.log('[DeliveriesConfig] Refetching config on app foreground');
      }

      void platformConfigurationQuery.refetch();
    });

    return () => {
      subscription.remove();
    };
  }, [hasAccessToken, platformConfigurationQuery]);

  useEffect(() => {
    if (!platformConfigurationQuery.data) {
      return;
    }

    if (__DEV__) {
      console.log('[DeliveriesConfig] Applying fetched config', platformConfigurationQuery.data);
    }

    const currentConfig: DeliveriesBootstrapConfig | null =
      deliveries.platformConfiguration && deliveries.deliveryMode
        ? {
            platformConfiguration: deliveries.platformConfiguration,
            appSettings: deliveries.appSettings,
            currency: deliveries.currency,
          }
        : null;

    const didConfigChange = !areBootstrapConfigsEqual(
      currentConfig,
      platformConfigurationQuery.data,
    );

    if (__DEV__) {
      console.log(
        didConfigChange
          ? '[DeliveriesConfig] Remote config changed. Updating cached colors.'
          : '[DeliveriesConfig] Remote config unchanged. Keeping cached colors.',
      );
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
    setHasCachedConfig(true);
    void setStoredDeliveriesBootstrapConfig(platformConfigurationQuery.data);
  }, [
    deliveries.appSettings,
    deliveries.currency,
    markDeliveriesConfigLoaded,
    deliveries.deliveryMode,
    deliveries.platformConfiguration,
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

    if (__DEV__) {
      console.log('[DeliveriesConfig] Failed to load config', platformConfigurationQuery.error);
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

    setDeliveriesAppSettings(null);
    setDeliveriesDeliveryMode(mapPlatformTypeToDeliveryMode('MULTI_VENDOR'));
    markDeliveriesConfigLoaded();
  }, [
    deliveries.deliveryMode,
    deliveries.platformConfiguration,
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
