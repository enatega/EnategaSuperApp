import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { appointmentsPlatformConfigurationService } from '../api/platformConfigurationService';
import {
  getStoredAppointmentsBootstrapConfig,
  setStoredAppointmentsBootstrapConfig,
} from '../storage/appointmentsBootstrapConfigStorage';
import { useAppointmentsConfigStore } from '../stores/useAppointmentsConfigStore';

const APPOINTMENTS_CONFIG_QUERY_KEY = [
  'appointments',
  'platform-configuration',
] as const;

export function useInitializeAppointmentsConfig() {
  const [isHydratingCache, setIsHydratingCache] = useState(true);
  const setConfiguration = useAppointmentsConfigStore(
    (state) => state.setConfiguration,
  );
  const setError = useAppointmentsConfigStore((state) => state.setError);

  useEffect(() => {
    let isMounted = true;

    void getStoredAppointmentsBootstrapConfig()
      .then((configuration) => {
        if (isMounted && configuration) {
          setConfiguration(configuration);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydratingCache(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setConfiguration]);

  const query = useQuery({
    queryKey: APPOINTMENTS_CONFIG_QUERY_KEY,
    queryFn: appointmentsPlatformConfigurationService.get,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }

    setConfiguration(query.data);
    void setStoredAppointmentsBootstrapConfig(query.data);
  }, [query.data, setConfiguration]);

  useEffect(() => {
    if (!query.error) {
      return;
    }

    setError(
      query.error instanceof Error
        ? query.error.message
        : 'Failed to load appointments configuration',
    );
  }, [query.error, setError]);

  return {
    ...query,
    isHydratingCache,
  };
}
