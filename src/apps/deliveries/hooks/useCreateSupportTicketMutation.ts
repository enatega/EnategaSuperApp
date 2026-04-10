import { useMutation } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import {
  supportTicketService,
  type CreateSupportTicketPayload,
  type CreateSupportTicketResponse,
} from '../api/supportTicketService';

type Options = {
  onSuccess?: (data: CreateSupportTicketResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useCreateSupportTicketMutation(options?: Options) {
  return useMutation<CreateSupportTicketResponse, ApiError, CreateSupportTicketPayload>({
    mutationFn: supportTicketService.createTicket,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
