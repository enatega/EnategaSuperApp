import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import { supportChatService } from '../api/supportChatService';
import type {
  SendSupportChatMessagePayload,
  SendSupportChatMessageResponse,
} from '../api/supportChatTypes';

export function useSendSupportChatMessage(
  options?: UseMutationOptions<
    SendSupportChatMessageResponse,
    ApiError,
    SendSupportChatMessagePayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendSupportChatMessageResponse,
    ApiError,
    SendSupportChatMessagePayload
  >({
    mutationFn: supportChatService.sendMessage,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: deliveryKeys.supportChat(),
      });
      queryClient.invalidateQueries({
        queryKey: deliveryKeys.supportChatBoxes({}),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
