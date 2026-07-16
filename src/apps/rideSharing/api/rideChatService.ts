import apiClient, { ApiError } from '../../../general/api/apiClient';
import type {
  RideChatBoxesResponse,
  RideChatMessagesResponse,
  SendRideChatMessagePayload,
  SendRideChatMessageResponse,
} from './rideChatServiceTypes';

const RIDE_CHAT_BASE = '/api/v1/apps/ride-hailing/chat';

function isSuccessfulStreamLostError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError
    && error.code === 'TRANSIENT_RESPONSE_STREAM_LOST'
    && error.status >= 200
    && error.status < 300
  );
}

export const rideChatService = {
  getChatBoxes: (userId: string) =>
    apiClient.get<RideChatBoxesResponse>(`${RIDE_CHAT_BASE}/${userId}`),

  getChatMessages: (chatBoxId: string) =>
    apiClient.get<RideChatMessagesResponse>(`${RIDE_CHAT_BASE}/messages/${chatBoxId}`),

  sendMessage: async (payload: SendRideChatMessagePayload) => {
    try {
      return await apiClient.post<SendRideChatMessageResponse>(
        `${RIDE_CHAT_BASE}/send`,
        payload,
        { suppressTransientSuccessStreamWarning: true },
      );
    } catch (error) {
      if (isSuccessfulStreamLostError(error)) {
        return {
          message: 'Message sent',
        };
      }

      throw error;
    }
  },
};
