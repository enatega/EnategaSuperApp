import apiClient from '../../../general/api/apiClient';
import type {
  SendSupportChatMessagePayload,
  SendSupportChatMessageResponse,
  SupportAdminsResponse,
  SupportChatBoxDetailResponse,
  SupportChatBoxesGroupedResponse,
  SupportChatMessagesResponse,
} from './supportChatTypes';

const SUPPORT_CHAT_BASE = '/api/v1/deliveries/support-chat-app';

export const supportChatService = {
  getAdmins: () =>
    apiClient.get<SupportAdminsResponse>(`${SUPPORT_CHAT_BASE}/admins`),

  getConversations: () =>
    apiClient.get<SupportChatBoxesGroupedResponse>(`${SUPPORT_CHAT_BASE}/conversations`),

  getGroupedChatBoxes: (params?: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    ticketType?: string[];
  }) => apiClient.get<SupportChatBoxesGroupedResponse>(`${SUPPORT_CHAT_BASE}/users`, params),

  getUserChatBoxes: (
    userId: string,
    params?: {
      fromDate?: string;
      toDate?: string;
      search?: string;
      offset?: number;
      limit?: number;
      priority?: string[];
    },
  ) => apiClient.get<SupportChatBoxesGroupedResponse>(`${SUPPORT_CHAT_BASE}/${userId}`, params),

  getChatMessages: (chatBoxId: string) =>
    apiClient.get<SupportChatMessagesResponse>(`${SUPPORT_CHAT_BASE}/messages/${chatBoxId}`),

  getChatBox: (chatBoxId: string) =>
    apiClient.get<SupportChatBoxDetailResponse>(`${SUPPORT_CHAT_BASE}/chat-box/${chatBoxId}`),

  sendMessage: (payload: SendSupportChatMessagePayload) =>
    apiClient.post<SendSupportChatMessageResponse>(`${SUPPORT_CHAT_BASE}/send`, payload),
};
