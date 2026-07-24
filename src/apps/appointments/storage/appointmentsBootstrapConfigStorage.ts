import * as SecureStore from 'expo-secure-store';
import type { AppointmentsPlatformConfiguration } from '../api/platformConfigurationService';

const APPOINTMENTS_BOOTSTRAP_CONFIG_KEY =
  'super_app_appointments_bootstrap_config';

export async function getStoredAppointmentsBootstrapConfig() {
  const value = await SecureStore.getItemAsync(
    APPOINTMENTS_BOOTSTRAP_CONFIG_KEY,
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AppointmentsPlatformConfiguration;
  } catch {
    return null;
  }
}

export async function setStoredAppointmentsBootstrapConfig(
  configuration: AppointmentsPlatformConfiguration,
) {
  await SecureStore.setItemAsync(
    APPOINTMENTS_BOOTSTRAP_CONFIG_KEY,
    JSON.stringify(configuration),
  );
}
