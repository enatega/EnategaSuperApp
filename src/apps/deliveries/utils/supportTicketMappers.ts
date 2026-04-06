import type { SupportTicketListItemResponse } from '../api/supportTicketService';

export type SupportTicketStatusTone = 'success' | 'info' | 'danger';

export type SupportTicketListItemModel = {
  chatBoxId?: string;
  dayNumber: string;
  dateLabel: string;
  id: string;
  orderIdLabel?: string;
  preview: string;
  statusLabel: string;
  statusTone: SupportTicketStatusTone;
  title: string;
  unreadCount?: number;
};

function toReadableText(value: string) {
  return value
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusTone(statusKey: string): SupportTicketStatusTone {
  const normalizedStatusKey = statusKey.trim().toLowerCase();

  if (normalizedStatusKey === 'opened' || normalizedStatusKey === 'open') {
    return 'success';
  }

  if (normalizedStatusKey === 'closed') {
    return 'info';
  }

  return 'danger';
}

export function mapSupportTicketToListItem(
  ticket: SupportTicketListItemResponse,
  orderIdTemplate: (orderId: string) => string,
): SupportTicketListItemModel {
  return {
    chatBoxId: ticket.chatBoxId,
    id: ticket.id,
    title: toReadableText(ticket.title),
    preview: ticket.subtitle,
    dayNumber: ticket.date.day,
    dateLabel: ticket.date.month.trim().toUpperCase(),
    orderIdLabel: ticket.orderId ? orderIdTemplate(ticket.orderId) : undefined,
    statusLabel: ticket.status.label,
    statusTone: getStatusTone(ticket.status.key),
    unreadCount: ticket.unreadCount > 0 ? ticket.unreadCount : undefined,
  };
}
