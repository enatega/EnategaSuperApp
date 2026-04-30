import { useMutation } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsToggleFavoriteServiceResponse } from '../api/types';

export default function useToggleFavoriteService() {
  return useMutation<
    HomeVisitsToggleFavoriteServiceResponse,
    ApiError,
    string
  >({
    mutationFn: (serviceId) =>
      homeVisitsSingleVendorDiscoveryService.toggleFavoriteService(serviceId),
  });
}
