import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import { homeVisitsSupportChatService } from '../api/supportChatService';
import type {
  SendSupportChatMessageResponse,
  SendSupportChatMessageToAdminPayload,
} from '../api/supportChatTypes';

export function useSendSupportChatMessageToAdmin(
  options?: UseMutationOptions<
    SendSupportChatMessageResponse,
    ApiError,
    SendSupportChatMessageToAdminPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<
    SendSupportChatMessageResponse,
    ApiError,
    SendSupportChatMessageToAdminPayload
  >({
    mutationFn: homeVisitsSupportChatService.sendMessageToAdmin,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: homeVisitsKeys.supportChat(),
        refetchType: 'inactive',
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
