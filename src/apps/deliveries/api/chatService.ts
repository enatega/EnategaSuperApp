import apiClient from '../../../general/api/apiClient';
import { apiConfig } from '../../../general/config/apiConfig';
import type {
  DeliveryChatBoxesResponse,
  DeliveryChatMessagesResponse,
  SendDeliveryChatMessagePayload,
  SendDeliveryChatMessageResponse,
} from './chatServiceTypes';

const DELIVERIES_CHAT_BASE = `${apiConfig.baseUrl}/apps/deliveries/chat`;

export const chatService = {
  getChatBoxes: (userId: string) =>
    apiClient.get<DeliveryChatBoxesResponse>(
      `${DELIVERIES_CHAT_BASE}/${userId}`,
    ),

  getChatMessages: (chatBoxId: string) =>
    apiClient.get<DeliveryChatMessagesResponse>(
      `${DELIVERIES_CHAT_BASE}/messages/${chatBoxId}`,
    ),

  sendMessage: (payload: SendDeliveryChatMessagePayload) => {
    console.log('deliveries chat send payload', payload);

    return apiClient.post<SendDeliveryChatMessageResponse>(
      `${DELIVERIES_CHAT_BASE}/send`,
      payload,
      { skipSessionExpiryHandling: true },
    );
  },
};
