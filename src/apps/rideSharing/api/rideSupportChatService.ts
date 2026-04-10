import apiClient from '../../../general/api/apiClient';
import type {
  RideSupportChatMessagesResponse,
  SendRideSupportChatMessagePayload,
  SendRideSupportChatMessageResponse,
} from './rideSupportChatServiceTypes';

const RIDE_SUPPORT_CHAT_BASE = '/api/v1/apps/ride-hailing/support-chat-app';

export const rideSupportChatService = {
  getChatMessages: (chatBoxId: string) =>
    apiClient.get<RideSupportChatMessagesResponse>(`${RIDE_SUPPORT_CHAT_BASE}/messages/${chatBoxId}`),

  sendMessage: (payload: SendRideSupportChatMessagePayload) =>
    apiClient.post<SendRideSupportChatMessageResponse>(`${RIDE_SUPPORT_CHAT_BASE}/send`, payload),
};
