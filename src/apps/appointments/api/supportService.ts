import apiClient from '../../../general/api/apiClient';

export type AppointmentSupportConversation = {
  id?: string;
  chatBoxId?: string;
  title?: string;
  status?: string;
  updatedAt?: string;
  latestMessage?: string | null;
  latestMessageAt?: string;
  sender?: { id?: string; name?: string | null } | null;
  receiver?: { id?: string; name?: string | null } | null;
};

export type AppointmentSupportAgent = {
  id?: string;
  userId?: string;
  name?: string | null;
  image?: string | null;
};

export type AppointmentSupportMessage = {
  id: string;
  sender_id?: string;
  senderId?: string;
  text: string;
  createdAt?: string;
};

export type AppointmentSupportTicket = {
  id: string;
  chatBoxId: string | null;
  assignedAdminId?: string | null;
  title: string;
  subtitle: string;
  category: string;
  reason: string;
  date: { day: string; month: string };
  status: { key: string; label: string };
  unreadCount: number;
};

export const appointmentSupportKeys = {
  tickets: ['appointments', 'support', 'tickets'] as const,
};

type ConversationsResponse =
  | AppointmentSupportConversation[]
  | {
      data?: AppointmentSupportConversation[];
      grouped?: {
        today?: AppointmentSupportConversation[];
        yesterday?: AppointmentSupportConversation[];
        older?: AppointmentSupportConversation[];
      };
    };

const BASE = '/api/v1/apps/general-bookings/support-chat-app';

export const appointmentSupportService = {
  getAgents: async () => {
    const response = await apiClient.get<{ admins?: AppointmentSupportAgent[] }>(`${BASE}/admins`);
    return response.admins ?? [];
  },
  getConversations: async () => {
    const response = await apiClient.get<ConversationsResponse>(`${BASE}/users`, {
      params: { limit: 50, offset: 0 },
    });
    if (Array.isArray(response)) return response;
    if (response.data) return response.data;
    return [
      ...(response.grouped?.today ?? []),
      ...(response.grouped?.yesterday ?? []),
      ...(response.grouped?.older ?? []),
    ];
  },
  getMessages: (chatBoxId: string) =>
    apiClient.get<{ messages?: AppointmentSupportMessage[] }>(`${BASE}/messages/${chatBoxId}`),
  sendMessage: (payload: { senderId: string; receiverId: string; text: string }) =>
    apiClient.post<{ chatBoxId: string; detail?: AppointmentSupportMessage }>(`${BASE}/send`, payload),
  createTicket: (payload: { category: string; reason: string; email: string; description: string }) =>
    apiClient.post<{ ticket: AppointmentSupportTicket; chatBoxId: string }>(
      '/api/v1/apps/general-bookings/support-tickets',
      payload,
    ),
  getTickets: () =>
    apiClient.get<{ tickets: AppointmentSupportTicket[]; total: number }>(
      '/api/v1/apps/general-bookings/support-tickets/my-tickets',
    ),
  sendTicketMessage: (chatBoxId: string, text: string) =>
    apiClient.post<{ chatBoxId: string; detail?: AppointmentSupportMessage }>(
      `${BASE}/chat-box/${chatBoxId}/send`,
      { text },
    ),
};
