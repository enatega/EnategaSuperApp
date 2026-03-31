import type {
  RideChatBoxRecord,
  RideChatBoxesResponse,
  RideChatMessageRecord,
  RideChatMessagesResponse,
} from '../api/rideChatServiceTypes';

function getResponseItems<T>(
  response?: T[] | { messages?: T[]; data?: T[] | { items?: T[] }; chatList?: T[] },
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

  if (Array.isArray(response.chatList)) {
    return response.chatList;
  }

  const { data } = response;

  if (Array.isArray(data)) {
    return data;
  }

  return data?.items ?? [];
}

export function getRideChatBoxes(response?: RideChatBoxesResponse) {
  return getResponseItems<RideChatBoxRecord>(response);
}

export function getRideChatMessages(response?: RideChatMessagesResponse) {
  return getResponseItems<RideChatMessageRecord>(response);
}

export function getRideChatBoxId(chatBox?: RideChatBoxRecord | null) {
  return chatBox?.chatBoxId ?? chatBox?.id ?? null;
}

export function getRideChatParticipantId(
  participant?: { id?: string } | null,
  fallbackId?: string,
) {
  return participant?.id ?? fallbackId ?? null;
}

export function formatRideChatTimeLabel(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase();
}
