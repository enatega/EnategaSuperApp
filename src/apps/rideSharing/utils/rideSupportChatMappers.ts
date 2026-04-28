import type {
  RideSupportChatBoxDetailResponse,
  RideSupportChatBoxRecord,
  RideSupportChatBoxesGroupedResponse,
  RideSupportChatMessageRecord,
  RideSupportChatMessagesResponse,
  RideSupportChatParticipant,
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

function sortByUpdatedAtDesc(items: RideSupportChatBoxRecord[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.updatedAt ?? left.updated_at ?? left.createdAt ?? left.created_at ?? 0).getTime();
    const rightTime = new Date(right.updatedAt ?? right.updated_at ?? right.createdAt ?? right.created_at ?? 0).getTime();

    return rightTime - leftTime;
  });
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function getRideSupportChatBox(response: RideSupportChatBoxDetailResponse | undefined) {
  if (!response) {
    return null;
  }

  if (Array.isArray(response)) {
    return null;
  }

  const responseRecord = response as Record<string, unknown>;

  if (isRecord(responseRecord.chatBox)) {
    return responseRecord.chatBox as RideSupportChatBoxRecord;
  }

  if (isRecord(responseRecord.chat_box)) {
    return responseRecord.chat_box as RideSupportChatBoxRecord;
  }

  if (isRecord(responseRecord.data)) {
    return responseRecord.data as RideSupportChatBoxRecord;
  }

  return response as RideSupportChatBoxRecord;
}

export function getRideSupportChatBoxId(chatBox: RideSupportChatBoxRecord | null | undefined) {
  if (!chatBox) {
    return '';
  }

  return chatBox.id ?? chatBox._id ?? chatBox.chatBoxId ?? chatBox.chat_box_id ?? '';
}

export function getRideSupportChatMessageId(message: RideSupportChatMessageRecord, index: number) {
  return message.id ?? message._id ?? `${message.createdAt ?? message.created_at ?? 'message'}-${index}`;
}

export function getRideSupportChatParticipantId(
  participant?: RideSupportChatParticipant | null,
  fallbackId?: string,
) {
  return participant?.id ?? participant?.userId ?? fallbackId ?? null;
}

export function getRideSupportChatOtherParticipant(
  chatBox: RideSupportChatBoxRecord | null | undefined,
  currentUserId?: string,
) {
  if (!chatBox) {
    return null;
  }

  if (chatBox.admin) {
    return chatBox.admin;
  }

  const otherUser = chatBox.otherUser ?? chatBox.other_user;

  if (otherUser) {
    return otherUser;
  }

  const senderId = chatBox.senderId ?? chatBox.sender_id ?? getRideSupportChatParticipantId(chatBox.sender);
  const receiverId = chatBox.receiverId ?? chatBox.receiver_id ?? getRideSupportChatParticipantId(chatBox.receiver);

  if (currentUserId && senderId === currentUserId) {
    return chatBox.receiver ?? null;
  }

  if (currentUserId && receiverId === currentUserId) {
    return chatBox.sender ?? null;
  }

  return chatBox.receiver ?? chatBox.sender ?? null;
}

export function getFirstRideSupportChatBox(response?: RideSupportChatBoxesGroupedResponse) {
  if (!response) {
    return null;
  }

  if (Array.isArray(response)) {
    return sortByUpdatedAtDesc(response)[0] ?? null;
  }

  const responseRecord = response as Record<string, unknown>;
  const directChatboxes = toArray<RideSupportChatBoxRecord>(responseRecord.chatboxes);

  if (directChatboxes.length > 0) {
    return sortByUpdatedAtDesc(directChatboxes)[0] ?? null;
  }

  const groupedCandidates = [
    ...toArray<RideSupportChatBoxRecord>(responseRecord.recent),
    ...toArray<RideSupportChatBoxRecord>(responseRecord.today),
    ...toArray<RideSupportChatBoxRecord>(responseRecord.yesterday),
    ...toArray<RideSupportChatBoxRecord>(responseRecord.past),
    ...toArray<RideSupportChatBoxRecord>(responseRecord.older),
    ...toArray<RideSupportChatBoxRecord>(responseRecord.items),
  ];

  if (groupedCandidates.length > 0) {
    return sortByUpdatedAtDesc(groupedCandidates)[0] ?? null;
  }

  if (Array.isArray(responseRecord.data)) {
    return sortByUpdatedAtDesc(responseRecord.data as RideSupportChatBoxRecord[])[0] ?? null;
  }

  if (isRecord(responseRecord.data)) {
    const nestedCandidates = [
      ...toArray<RideSupportChatBoxRecord>(responseRecord.data.recent),
      ...toArray<RideSupportChatBoxRecord>(responseRecord.data.today),
      ...toArray<RideSupportChatBoxRecord>(responseRecord.data.yesterday),
      ...toArray<RideSupportChatBoxRecord>(responseRecord.data.past),
      ...toArray<RideSupportChatBoxRecord>(responseRecord.data.older),
      ...toArray<RideSupportChatBoxRecord>(responseRecord.data.items),
    ];

    return sortByUpdatedAtDesc(nestedCandidates)[0] ?? null;
  }

  return null;
}
