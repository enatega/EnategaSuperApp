import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import {
  supportTicketService,
  type SupportMyTicketsResponse,
} from '../api/supportTicketService';

export function useSupportMyTicketsQuery() {
  return useQuery<SupportMyTicketsResponse, ApiError>({
    queryKey: deliveryKeys.supportMyTickets(),
    queryFn: supportTicketService.getMyTickets,
    staleTime: 30 * 1000,
  });
}
