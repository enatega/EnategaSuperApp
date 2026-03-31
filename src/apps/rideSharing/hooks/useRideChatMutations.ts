import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { rideKeys } from '../api/queryKeys';
import { rideChatService } from '../api/rideChatService';
import type {
  SendRideChatMessagePayload,
  SendRideChatMessageResponse,
} from '../api/rideChatServiceTypes';

export function useSendRideChatMessage(
  options?: UseMutationOptions<
    SendRideChatMessageResponse,
    ApiError,
    SendRideChatMessagePayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendRideChatMessageResponse,
    ApiError,
    SendRideChatMessagePayload
  >({
    mutationFn: rideChatService.sendMessage,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: rideKeys.chatBoxes(variables.senderId),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
