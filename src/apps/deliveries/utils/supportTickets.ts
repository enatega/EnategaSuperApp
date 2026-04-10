export type SupportTicketStatus = 'open' | 'closed' | 'pending';

export type SupportTicket = {
  dayLabelKey: string;
  dayNumber: string;
  id: string;
  orderId: string;
  previewKey: string;
  status: SupportTicketStatus;
  titleKey: string;
  unreadCount?: number;
};

export const supportTickets: SupportTicket[] = [
  {
    dayLabelKey: 'support_tickets_day_fri',
    dayNumber: '20',
    id: 'ticket-how-to-order-open',
    orderId: 'ORD123',
    previewKey: 'support_tickets_preview_how_to_order',
    status: 'open',
    titleKey: 'support_tickets_title_how_to_order',
    unreadCount: 2,
  },
  {
    dayLabelKey: 'support_tickets_day_fri',
    dayNumber: '20',
    id: 'ticket-how-to-order-closed',
    orderId: 'ORD123',
    previewKey: 'support_tickets_preview_how_to_order',
    status: 'closed',
    titleKey: 'support_tickets_title_how_to_order',
  },
  {
    dayLabelKey: 'support_tickets_day_fri',
    dayNumber: '20',
    id: 'ticket-how-to-order-pending',
    orderId: 'ORD123',
    previewKey: 'support_tickets_preview_how_to_order',
    status: 'pending',
    titleKey: 'support_tickets_title_how_to_order',
  },
];
