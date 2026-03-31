import apiClient from '../../../general/api/apiClient';

const SUPPORT_TICKETS_BASE = '/api/v1/deliveries/support-tickets';

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

export const supportTicketService = {
  createTicket: (payload: CreateSupportTicketPayload) =>
    apiClient.post<CreateSupportTicketResponse>(SUPPORT_TICKETS_BASE, payload),
};
