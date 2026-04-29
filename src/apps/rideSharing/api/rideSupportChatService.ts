import apiClient from '../../../general/api/apiClient';
import type {
  RideSupportChatBoxDetailResponse,
  RideSupportChatBoxesGroupedResponse,
  RideSupportChatMessagesResponse,
  SendRideSupportChatMessagePayload,
  SendRideSupportChatMessageToChatBoxPayload,
  SendRideSupportChatMessageResponse,
} from './rideSupportChatServiceTypes';

const RIDE_SUPPORT_CHAT_BASE = '/api/v1/apps/ride-hailing/support-chat';
const RIDE_SUPPORT_CHAT_APP_BASE = '/api/v1/apps/ride-hailing/support-chat-app';

export const rideSupportChatService = {
  getGroupedChatBoxes: (params?: {
    status?: string;
    search?: string;
    from?: string;
    to?: string;
    limit?: number;
    offset?: number;
    ticketType?: string[];
  }) => apiClient.get<RideSupportChatBoxesGroupedResponse>(`${RIDE_SUPPORT_CHAT_BASE}/users`, params),

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
  ) => apiClient.get<RideSupportChatBoxesGroupedResponse>(`${RIDE_SUPPORT_CHAT_BASE}/${userId}`, params),

  getChatBox: (chatBoxId: string) =>
    apiClient.get<RideSupportChatBoxDetailResponse>(`${RIDE_SUPPORT_CHAT_BASE}/chat-box/${chatBoxId}`),

  getChatMessages: (chatBoxId: string) =>
    apiClient.get<RideSupportChatMessagesResponse>(`${RIDE_SUPPORT_CHAT_BASE}/messages/${chatBoxId}`),

  getMyActiveMessages: () =>
    apiClient.get<RideSupportChatMessagesResponse>(`${RIDE_SUPPORT_CHAT_APP_BASE}/my-active-messages`),

  sendMessage: (payload: SendRideSupportChatMessagePayload) =>
    apiClient.post<SendRideSupportChatMessageResponse>(`${RIDE_SUPPORT_CHAT_BASE}/send`, payload),

  sendMessageToChatBox: (payload: SendRideSupportChatMessageToChatBoxPayload) =>
    apiClient.post<SendRideSupportChatMessageResponse>(`${RIDE_SUPPORT_CHAT_APP_BASE}/send-to-admin`, payload),
};
