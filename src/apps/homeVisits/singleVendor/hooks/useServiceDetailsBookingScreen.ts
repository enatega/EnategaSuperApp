import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import type { HomeVisitsSingleVendorServiceBookingScreenResponse } from '../../types/serviceDetails';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';

export default function useServiceDetailsBookingScreen(serviceId: string) {
  const query = useQuery<HomeVisitsSingleVendorServiceBookingScreenResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorServiceBookingScreen(serviceId),
    queryFn: () => homeVisitsSingleVendorDiscoveryService.getServiceBookingScreen(serviceId),
    enabled: Boolean(serviceId),
    staleTime: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (!__DEV__) {
      return;
    }

    console.log('[useServiceDetailsBookingScreen] state changed', {
      serviceId,
      isPending: query.isPending,
      isFetching: query.isFetching,
      isError: query.isError,
      hasData: Boolean(query.data),
      errorMessage: query.error?.message,
    });
  }, [
    query.data,
    query.error?.message,
    query.isError,
    query.isFetching,
    query.isPending,
    serviceId,
  ]);

  return query;
}
