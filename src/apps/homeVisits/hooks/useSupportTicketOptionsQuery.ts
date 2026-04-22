import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import {
  homeVisitsSupportTicketService,
  type SupportTicketFormConfigResponse,
} from '../api/supportTicketService';

export function useSupportTicketOptionsQuery() {
  return useQuery<SupportTicketFormConfigResponse, ApiError>({
    queryKey: homeVisitsKeys.supportTicketOptions(),
    queryFn: homeVisitsSupportTicketService.getOptions,
    staleTime: 5 * 60 * 1000,
  });
}

