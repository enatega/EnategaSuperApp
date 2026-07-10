import apiClient from '../../../general/api/apiClient';
import type {
  SendSupportChatMessageResponse,
  SendSupportChatMessageToAdminPayload,
  SupportAdminsResponse,
  SupportChatBoxDetailResponse,
  SupportChatBoxesGroupedResponse,
  SupportMyActiveMessagesResponse,
} from './supportChatTypes';

const SUPPORT_CHAT_BASE = '/api/v1/home-services/support-chat-app';

export const homeVisitsSupportChatService = {
  getAdmins: () =>
    apiClient.get<SupportAdminsResponse>(`${SUPPORT_CHAT_BASE}/admins`),

  getConversations: () =>
    apiClient.get<SupportChatBoxesGroupedResponse>(`${SUPPORT_CHAT_BASE}/conversations`),

  getChatBox: (chatBoxId: string) =>
    apiClient.get<SupportChatBoxDetailResponse>(`${SUPPORT_CHAT_BASE}/chat-box/${chatBoxId}`),

  getMyActiveMessages: () =>
    apiClient.get<SupportMyActiveMessagesResponse>(`${SUPPORT_CHAT_BASE}/my-active-messages`),

  sendMessageToAdmin: (payload: SendSupportChatMessageToAdminPayload) =>
    apiClient.post<SendSupportChatMessageResponse>(`${SUPPORT_CHAT_BASE}/send-to-admin`, payload),
};

export type {
  SendSupportChatMessageResponse,
  SendSupportChatMessageToAdminPayload,
  SupportAdminsResponse,
  SupportChatBoxDetailResponse,
  SupportChatBoxesGroupedResponse,
  SupportMyActiveMessagesResponse,
};
