import type {
  RideSupportChatMessageRecord,
  RideSupportChatMessagesResponse,
} from '../api/rideSupportChatServiceTypes';

function getResponseItems<T>(
  response?: T[] | { messages?: T[]; data?: T[] | { items?: T[] } },
): T[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.messages)) {
    return response.messages;
  }

  const { data } = response;

  if (Array.isArray(data)) {
    return data;
  }

  return data?.items ?? [];
}

export function getRideSupportChatMessages(response?: RideSupportChatMessagesResponse) {
  return getResponseItems<RideSupportChatMessageRecord>(response);
}

export function getRideSupportChatMessageId(message: RideSupportChatMessageRecord, index: number) {
  return message.id ?? message._id ?? `${message.createdAt ?? message.created_at ?? 'message'}-${index}`;
}

export function getRideSupportChatParticipantId(
  participant?: { id?: string } | null,
  fallbackId?: string,
) {
  return participant?.id ?? fallbackId ?? null;
}
