import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { rideKeys } from '../api/queryKeys';
import { rideSupportChatService } from '../api/rideSupportChatService';
import type {
  RideSupportChatBoxDetailResponse,
  RideSupportChatBoxesGroupedResponse,
  RideSupportChatMessagesResponse,
} from '../api/rideSupportChatServiceTypes';

export function useRideSupportGroupedChatBoxes(params?: {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  ticketType?: string[];
}) {
  return useQuery<RideSupportChatBoxesGroupedResponse, ApiError>({
    queryKey: rideKeys.supportChatBoxes(params ?? {}),
    queryFn: () => rideSupportChatService.getGroupedChatBoxes(params),
    staleTime: 30 * 1000,
  });
}

export function useRideSupportUserChatBoxes(
  userId?: string,
  params?: {
    fromDate?: string;
    toDate?: string;
    search?: string;
    offset?: number;
    limit?: number;
    priority?: string[];
  },
) {
  return useQuery<RideSupportChatBoxesGroupedResponse, ApiError>({
    queryKey: rideKeys.supportChatBoxesByUser(userId ?? 'unknown', params ?? {}),
    queryFn: () => rideSupportChatService.getUserChatBoxes(userId ?? '', params),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useRideSupportChatBox(chatBoxId?: string) {
  return useQuery<RideSupportChatBoxDetailResponse, ApiError>({
    queryKey: rideKeys.supportChatBox(chatBoxId ?? 'unknown'),
    queryFn: () => rideSupportChatService.getChatBox(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}

export function useRideSupportChatMessages(chatBoxId?: string) {
  return useQuery<RideSupportChatMessagesResponse, ApiError>({
    queryKey: rideKeys.supportChatMessages(chatBoxId ?? 'unknown'),
    queryFn: () => rideSupportChatService.getChatMessages(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}

export function useRideSupportMyActiveMessages(userId?: string) {
  return useQuery<RideSupportChatMessagesResponse, ApiError>({
    queryKey: rideKeys.supportChatMyActiveMessages(userId ?? 'unknown'),
    queryFn: () => rideSupportChatService.getMyActiveMessages(),
    enabled: Boolean(userId),
    staleTime: 10 * 1000,
  });
}
