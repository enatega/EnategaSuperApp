import apiClient from '../../../general/api/apiClient';
import type {
  RideChatBoxesResponse,
  RideChatMessagesResponse,
  SendRideChatMessagePayload,
  SendRideChatMessageResponse,
} from './rideChatServiceTypes';

const RIDE_CHAT_BASE = '/api/v1/apps/ride-hailing/chat';

export const rideChatService = {
  getChatBoxes: (userId: string) =>
    apiClient.get<RideChatBoxesResponse>(`${RIDE_CHAT_BASE}/${userId}`),

  getChatMessages: (chatBoxId: string) =>
    apiClient.get<RideChatMessagesResponse>(`${RIDE_CHAT_BASE}/messages/${chatBoxId}`),

  sendMessage: (payload: SendRideChatMessagePayload) =>
    apiClient.post<SendRideChatMessageResponse>(`${RIDE_CHAT_BASE}/send`, payload),
};
