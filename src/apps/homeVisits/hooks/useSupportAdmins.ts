import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import {
  homeVisitsSupportChatService,
  type SupportAdminsResponse,
  type SupportChatBoxDetailResponse,
  type SupportChatBoxesGroupedResponse,
  type SupportMyActiveMessagesResponse,
} from '../api/supportChatService';

export function useSupportAdmins() {
  return useQuery<SupportAdminsResponse, ApiError>({
    queryKey: homeVisitsKeys.supportChatAdmins(),
    queryFn: () => homeVisitsSupportChatService.getAdmins(),
    staleTime: 30 * 1000,
  });
}

export function useSupportConversations() {
  return useQuery<SupportChatBoxesGroupedResponse, ApiError>({
    queryKey: homeVisitsKeys.supportChatConversations(),
    queryFn: () => homeVisitsSupportChatService.getConversations(),
    staleTime: 30 * 1000,
  });
}

export function useSupportChatBox(chatBoxId?: string) {
  return useQuery<SupportChatBoxDetailResponse, ApiError>({
    queryKey: homeVisitsKeys.supportChatBox(chatBoxId ?? 'unknown'),
    queryFn: () => homeVisitsSupportChatService.getChatBox(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}

export function useSupportMyActiveMessages() {
  return useQuery<SupportMyActiveMessagesResponse, ApiError>({
    queryKey: homeVisitsKeys.supportChatMyActiveMessages(),
    queryFn: () => homeVisitsSupportChatService.getMyActiveMessages(),
    staleTime: 10 * 1000,
  });
}
