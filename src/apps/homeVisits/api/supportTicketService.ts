import apiClient from '../../../general/api/apiClient';

const SUPPORT_TICKETS_BASE = '/api/v1/home-services/support-tickets';
const SUPPORT_TICKET_OPTIONS_PATH = '/api/v1/home-services/support-tickets/options';
const SUPPORT_MY_TICKETS_PATH = `${SUPPORT_TICKETS_BASE}/my-tickets`;

export type SupportTicketCategoryConfig = {
  key: string;
  reasons: string[];
};

export type SupportTicketFormConfigResponse = {
  categories: SupportTicketCategoryConfig[];
  businessTypes: string[];
  teamSizes: string[];
  requiredByCategory?: Record<string, string[]>;
};

export type CreateSupportTicketPayload = {
  category: string;
  reason: string;
  email: string;
  fullName?: string;
  countryRegion?: string;
  mobileNumber?: string;
  businessName?: string;
  businessType?: string;
  teamSize?: string;
  description: string;
  attachmentUrls?: string[];
  priority?: 'low' | 'medium' | 'high';
  assignedAdminId?: string;
};

export type CreateSupportTicketResponse = {
  message?: string;
  success?: boolean;
  data?: {
    id?: string;
    _id?: string;
    ticketId?: string;
  };
};

export type SupportTicketListDate = {
  day: string;
  month: string;
};

export type SupportTicketListStatus = {
  key: string;
  label: string;
};

export type SupportTicketListItemResponse = {
  id: string;
  assignedAdminId?: string | null;
  chatBoxId?: string;
  title: string;
  subtitle: string;
  date: SupportTicketListDate;
  orderId: string | null;
  status: SupportTicketListStatus;
  unreadCount: number;
};

export type SupportMyTicketsResponse = {
  message: string;
  total: number;
  tickets: SupportTicketListItemResponse[];
};

export const homeVisitsSupportTicketService = {
  getOptions: () =>
    apiClient.get<SupportTicketFormConfigResponse>(SUPPORT_TICKET_OPTIONS_PATH),
  getMyTickets: () =>
    apiClient.get<SupportMyTicketsResponse>(SUPPORT_MY_TICKETS_PATH),
  createTicket: (payload: CreateSupportTicketPayload) =>
    apiClient.post<CreateSupportTicketResponse>(SUPPORT_TICKETS_BASE, payload),
};
