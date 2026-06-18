import { useQuery } from '@tanstack/react-query';
import { homeVisitsKeys } from '../../api/queryKeys';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type { HomeVisitsSingleVendorContractDetails } from '../api/types';

export default function useSingleVendorContractDetails(contractId: string) {
  return useQuery<HomeVisitsSingleVendorContractDetails, ApiError>({
    queryKey: homeVisitsKeys.singleVendorContractDetail(contractId),
    queryFn: () => homeVisitsSingleVendorDiscoveryService.getContractDetails(contractId),
    enabled: Boolean(contractId),
    staleTime: 60 * 1000,
  });
}
