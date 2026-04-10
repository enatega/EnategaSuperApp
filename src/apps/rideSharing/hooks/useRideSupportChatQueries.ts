import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { rideKeys } from '../api/queryKeys';
import { rideSupportChatService } from '../api/rideSupportChatService';
import type { RideSupportChatMessagesResponse } from '../api/rideSupportChatServiceTypes';

export function useRideSupportChatMessages(chatBoxId?: string) {
  return useQuery<RideSupportChatMessagesResponse, ApiError>({
    queryKey: rideKeys.supportChatMessages(chatBoxId ?? 'unknown'),
    queryFn: () => rideSupportChatService.getChatMessages(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}
