import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import { supportChatService } from '../api/supportChatService';
import type {
  SupportAdminsResponse,
  SupportChatBoxDetailResponse,
  SupportChatBoxesGroupedResponse,
  SupportChatMessagesResponse,
} from '../api/supportChatTypes';

export function useSupportGroupedChatBoxes(params?: {
  status?: string;
  search?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  ticketType?: string[];
}) {
  return useQuery<SupportChatBoxesGroupedResponse, ApiError>({
    queryKey: deliveryKeys.supportChatBoxes(params ?? {}),
    queryFn: () => supportChatService.getGroupedChatBoxes(params),
    staleTime: 30 * 1000,
  });
}

export function useSupportConversations() {
  return useQuery<SupportChatBoxesGroupedResponse, ApiError>({
    queryKey: deliveryKeys.supportChatBoxes({ scope: 'conversations' }),
    queryFn: () => supportChatService.getConversations(),
    staleTime: 30 * 1000,
  });
}

export function useSupportAdmins() {
  return useQuery<SupportAdminsResponse, ApiError>({
    queryKey: deliveryKeys.supportChatBoxes({ scope: 'admins' }),
    queryFn: () => supportChatService.getAdmins(),
    staleTime: 30 * 1000,
  });
}

export function useSupportUserChatBoxes(
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
  return useQuery<SupportChatBoxesGroupedResponse, ApiError>({
    queryKey: deliveryKeys.supportChatBoxesByUser(userId ?? 'unknown', params ?? {}),
    queryFn: () => supportChatService.getUserChatBoxes(userId ?? '', params),
    enabled: Boolean(userId),
    staleTime: 30 * 1000,
  });
}

export function useSupportChatBox(chatBoxId?: string) {
  return useQuery<SupportChatBoxDetailResponse, ApiError>({
    queryKey: deliveryKeys.supportChatBox(chatBoxId ?? 'unknown'),
    queryFn: () => supportChatService.getChatBox(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}

export function useSupportChatMessages(chatBoxId?: string) {
  return useQuery<SupportChatMessagesResponse, ApiError>({
    queryKey: deliveryKeys.supportChatMessages(chatBoxId ?? 'unknown'),
    queryFn: () => supportChatService.getChatMessages(chatBoxId ?? ''),
    enabled: Boolean(chatBoxId),
    staleTime: 10 * 1000,
  });
}
