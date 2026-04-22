import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import {
  homeVisitsSupportTicketService,
  type SupportMyTicketsResponse,
} from '../api/supportTicketService';

export function useSupportMyTicketsQuery() {
  return useQuery<SupportMyTicketsResponse, ApiError>({
    queryKey: homeVisitsKeys.supportTickets(),
    queryFn: homeVisitsSupportTicketService.getMyTickets,
    staleTime: 30 * 1000,
  });
}

