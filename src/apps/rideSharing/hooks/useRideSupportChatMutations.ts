import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { rideKeys } from '../api/queryKeys';
import { rideSupportChatService } from '../api/rideSupportChatService';
import type {
  SendRideSupportChatMessagePayload,
  SendRideSupportChatMessageResponse,
  SendRideSupportChatMessageToChatBoxPayload,
} from '../api/rideSupportChatServiceTypes';

export function useSendRideSupportChatMessage(
  options?: UseMutationOptions<
    SendRideSupportChatMessageResponse,
    ApiError,
    SendRideSupportChatMessagePayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendRideSupportChatMessageResponse,
    ApiError,
    SendRideSupportChatMessagePayload
  >({
    mutationFn: rideSupportChatService.sendMessage,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      const nextChatBoxId =
        data.chatBoxId ??
        data.data?.chatBoxId ??
        data.detail?.chatBoxId ??
        data.detail?.chat_box_id ??
        variables.chatBoxId;

      if (nextChatBoxId) {
        queryClient.invalidateQueries({
          queryKey: rideKeys.supportChatBox(nextChatBoxId),
        });
        queryClient.invalidateQueries({
          queryKey: rideKeys.supportChatMessages(nextChatBoxId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: rideKeys.supportChat(),
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useSendRideSupportChatMessageToChatBox(
  options?: UseMutationOptions<
    SendRideSupportChatMessageResponse,
    ApiError,
    SendRideSupportChatMessageToChatBoxPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendRideSupportChatMessageResponse,
    ApiError,
    SendRideSupportChatMessageToChatBoxPayload
  >({
    mutationFn: rideSupportChatService.sendMessageToChatBox,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      const nextChatBoxId =
        data.chatBoxId ??
        data.data?.chatBoxId ??
        data.detail?.chatBoxId ??
        data.detail?.chat_box_id ??
        variables.chatBoxId;

      if (nextChatBoxId) {
        queryClient.invalidateQueries({
          queryKey: rideKeys.supportChatBox(nextChatBoxId),
        });
        queryClient.invalidateQueries({
          queryKey: rideKeys.supportChatMessages(nextChatBoxId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: rideKeys.supportChat(),
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
