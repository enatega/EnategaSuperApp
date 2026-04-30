import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import {
  homeVisitsSupportChatService,
  type SupportAdminsResponse,
  type SupportChatBoxesGroupedResponse,
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
