import * as SecureStore from 'expo-secure-store';
import type {
  AppCurrency,
  DeliveriesAppSettings,
  DeliveriesPlatformConfiguration,
} from '../../../general/stores/useAppConfigStore';

const DELIVERIES_BOOTSTRAP_CONFIG_STORAGE_KEY =
  'deliveries_bootstrap_config_v1';

export type DeliveriesBootstrapConfigCache = {
  platformConfiguration: DeliveriesPlatformConfiguration;
  appSettings: DeliveriesAppSettings | null;
  currency: AppCurrency | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPlatformConfiguration(
  value: unknown,
): value is DeliveriesPlatformConfiguration {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.platform_type === 'string' &&
    typeof value.created_at === 'string' &&
    typeof value.updated_at === 'string'
  );
}

function isAppSettings(value: unknown): value is DeliveriesAppSettings {
  return (
    isRecord(value) &&
    typeof value.is_maintenance_mode === 'boolean' &&
    (typeof value.maintenance_message === 'string' ||
      value.maintenance_message === null) &&
    (typeof value.promotional_banner === 'string' ||
      value.promotional_banner === null) &&
    (typeof value.promotional_banner_title === 'string' ||
      value.promotional_banner_title === null) &&
    (typeof value.promotional_banner_description === 'string' ||
      value.promotional_banner_description === null) &&
    (typeof value.primary_color === 'string' || value.primary_color === null) &&
    (typeof value.secondary_color === 'string' ||
      value.secondary_color === null) &&
    (typeof value.tertiary_color === 'string' || value.tertiary_color === null)
  );
}

function isCurrency(value: unknown): value is AppCurrency {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.code === 'string' &&
    typeof value.name === 'string' &&
    typeof value.symbol === 'string' &&
    typeof value.rateToBase === 'string' &&
    typeof value.isActive === 'boolean' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  );
}

function isDeliveriesBootstrapConfigCache(
  value: unknown,
): value is DeliveriesBootstrapConfigCache {
  return (
    isRecord(value) &&
    isPlatformConfiguration(value.platformConfiguration) &&
    (value.appSettings === null || isAppSettings(value.appSettings)) &&
    (value.currency === null || isCurrency(value.currency))
  );
}

export async function getStoredDeliveriesBootstrapConfig() {
  const rawValue = await SecureStore.getItemAsync(
    DELIVERIES_BOOTSTRAP_CONFIG_STORAGE_KEY,
  );

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    return isDeliveriesBootstrapConfigCache(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export async function setStoredDeliveriesBootstrapConfig(
  config: DeliveriesBootstrapConfigCache,
) {
  await SecureStore.setItemAsync(
    DELIVERIES_BOOTSTRAP_CONFIG_STORAGE_KEY,
    JSON.stringify(config),
  );
}
