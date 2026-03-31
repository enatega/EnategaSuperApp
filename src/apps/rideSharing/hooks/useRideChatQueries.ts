import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { rideKeys } from '../api/queryKeys';
import { rideChatService } from '../api/rideChatService';
import type { RideChatBoxesResponse, RideChatMessagesResponse } from '../api/rideChatServiceTypes';

export function useRideChatBoxes(userId?: string) {
  return useQuery<RideChatBoxesResponse, ApiError>({
    queryKey: rideKeys.chatBoxes(userId ?? 'unknown'),
    queryFn: () => rideChatService.getChatBoxes(userId ?? ''),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useRideChatMessages(chatBoxId?: string) {
  return useQuery<RideChatMessagesResponse, ApiError>({
    queryKey: rideKeys.chatMessages(chatBoxId ?? 'unknown'),
    queryFn: () => rideChatService.getChatMessages(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}
