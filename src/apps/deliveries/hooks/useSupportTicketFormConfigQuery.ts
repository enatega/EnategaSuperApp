import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import {
  supportTicketService,
  type SupportTicketFormConfigResponse,
} from '../api/supportTicketService';

export function useSupportTicketFormConfigQuery() {
  return useQuery<SupportTicketFormConfigResponse, ApiError>({
    queryKey: deliveryKeys.supportTicketFormConfig(),
    queryFn: supportTicketService.getFormConfig,
    staleTime: 5 * 60 * 1000,
  });
}
