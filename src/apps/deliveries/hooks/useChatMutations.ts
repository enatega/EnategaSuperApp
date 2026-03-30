import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { chatService } from '../api/chatService';
import { deliveryKeys } from '../api/queryKeys';
import type {
  SendDeliveryChatMessagePayload,
  SendDeliveryChatMessageResponse,
} from '../api/chatServiceTypes';

export function useSendDeliveryChatMessage(
  options?: UseMutationOptions<
    SendDeliveryChatMessageResponse,
    ApiError,
    SendDeliveryChatMessagePayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendDeliveryChatMessageResponse,
    ApiError,
    SendDeliveryChatMessagePayload
  >({
    mutationFn: chatService.sendMessage,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: deliveryKeys.chatBoxes(variables.senderId),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
