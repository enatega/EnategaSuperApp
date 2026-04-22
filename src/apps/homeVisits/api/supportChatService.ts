import apiClient from '../../../general/api/apiClient';
import type {
  SupportAdminsResponse,
  SupportChatBoxesGroupedResponse,
} from './supportChatTypes';

const SUPPORT_CHAT_BASE = '/api/v1/apps/home-services/support-chat-app';

export const homeVisitsSupportChatService = {
  getAdmins: () =>
    apiClient.get<SupportAdminsResponse>(`${SUPPORT_CHAT_BASE}/admins`),

  getConversations: () =>
    apiClient.get<SupportChatBoxesGroupedResponse>(`${SUPPORT_CHAT_BASE}/conversations`),
};

export type { SupportAdminsResponse, SupportChatBoxesGroupedResponse };
