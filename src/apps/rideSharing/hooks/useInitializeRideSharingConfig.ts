import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideSharingAppConfigService } from '../api/appConfigService';
import { ApiError } from '../../../general/api/apiClient';
import {
  useAppConfigStore,
  type AppCurrency,
  type GlobalEmergencyContact,
} from '../../../general/stores/useAppConfigStore';

type RideSharingBootstrapConfig = {
  currency: AppCurrency | null;
  emergencyContact: GlobalEmergencyContact | null;
};

export function useInitializeRideSharingConfig() {
  const {
    rideSharing,
    setRideSharingCurrency,
    setRideSharingEmergencyContact,
    setRideSharingConfigLoading,
    setRideSharingConfigError,
    markRideSharingConfigLoaded,
  } = useAppConfigStore();

  const rideSharingConfigQuery = useQuery<RideSharingBootstrapConfig, ApiError>({
    queryKey: rideKeys.appConfig(),
    queryFn: async () => {
      const [currencies, emergencyContact] = await Promise.all([
        rideSharingAppConfigService.getCurrencies(),
        rideSharingAppConfigService.getEmergencyContact(),
      ]);

      const activeCurrency =
        currencies.find((currency) => currency.isActive) ?? currencies[0] ?? null;

      return {
        currency: activeCurrency,
        emergencyContact,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    enabled: !rideSharing.isLoaded,
  });

  useEffect(() => {
    setRideSharingConfigLoading(
      rideSharingConfigQuery.isLoading || rideSharingConfigQuery.isFetching,
    );
  }, [
    rideSharingConfigQuery.isFetching,
    rideSharingConfigQuery.isLoading,
    setRideSharingConfigLoading,
  ]);

  useEffect(() => {
    if (!rideSharingConfigQuery.data) {
      return;
    }

    setRideSharingCurrency(rideSharingConfigQuery.data.currency);
    setRideSharingEmergencyContact(rideSharingConfigQuery.data.emergencyContact);
    markRideSharingConfigLoaded();
    setRideSharingConfigError(null);
  }, [
    markRideSharingConfigLoaded,
    setRideSharingConfigError,
    setRideSharingCurrency,
    setRideSharingEmergencyContact,
    rideSharingConfigQuery.data,
  ]);

  useEffect(() => {
    if (!rideSharingConfigQuery.error) {
      return;
    }

    const errorMessage =
      rideSharingConfigQuery.error instanceof ApiError
        ? rideSharingConfigQuery.error.message
        : 'Failed to load ride sharing configuration';

    setRideSharingConfigError(errorMessage);
  }, [rideSharingConfigQuery.error, setRideSharingConfigError]);

  return rideSharingConfigQuery;
}
