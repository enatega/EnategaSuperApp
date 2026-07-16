import type {
  SupportChatBoxDetailResponse,
  SupportChatBoxRecord,
  SupportChatBoxesGroupedResponse,
  SupportChatMessageRecord,
  SupportMyActiveMessagesResponse,
  SupportChatParticipant,
} from '../api/supportChatTypes';

const AVATAR_TONES = ['cardPeach', 'cardBlue', 'cardMint', 'cardLavender', 'primaryDark'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseSupportChatDate(value?: string) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const normalizedValue = /(?:Z|[+-]\d{2}:\d{2})$/i.test(trimmedValue)
    ? trimmedValue
    : `${trimmedValue}Z`;
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function sortByUpdatedAtDesc(items: SupportChatBoxRecord[]) {
  return [...items].sort((left, right) => {
    const leftTime = parseSupportChatDate(
      left.updatedAt ?? left.updated_at ?? left.createdAt ?? left.created_at,
    )?.getTime() ?? 0;
    const rightTime = parseSupportChatDate(
      right.updatedAt ?? right.updated_at ?? right.createdAt ?? right.created_at,
    )?.getTime() ?? 0;

    return rightTime - leftTime;
  });
}

export function getSupportChatBoxId(chatBox: SupportChatBoxRecord | null | undefined) {
  if (!chatBox) {
    return '';
  }

  return chatBox.id ?? chatBox._id ?? chatBox.chatBoxId ?? chatBox.chat_box_id ?? '';
}

export function getSupportChatMessageId(message: SupportChatMessageRecord) {
  return (
    message.id ??
    message._id ??
    `${message.createdAt ?? message.created_at ?? 'message'}-${message.text ?? message.message ?? ''}`
  );
}

export function getSupportChatParticipantId(participant?: SupportChatParticipant | null) {
  if (!participant) {
    return '';
  }

  return participant.id ?? participant.userId ?? '';
}

export function getSupportChatParticipantName(participant?: SupportChatParticipant | null) {
  if (!participant) {
    return '';
  }

  return (
    participant.fullName ??
    participant.full_name ??
    participant.name ??
    participant.email ??
    participant.phone ??
    ''
  );
}

export function getSupportChatMessages(
  response:
    | SupportChatBoxDetailResponse
    | SupportMyActiveMessagesResponse
    | undefined,
) {
  if (!response) {
    return [] as SupportChatMessageRecord[];
  }

  if (Array.isArray(response)) {
    return response as SupportChatMessageRecord[];
  }

  if (isRecord(response)) {
    const responseRecord = response as Record<string, unknown>;

    if (Array.isArray(responseRecord.messages)) {
      return responseRecord.messages as SupportChatMessageRecord[];
    }

    if (isRecord(responseRecord.chatBox) && Array.isArray(responseRecord.chatBox.messages)) {
      return responseRecord.chatBox.messages as SupportChatMessageRecord[];
    }

    if (isRecord(responseRecord.chat_box) && Array.isArray(responseRecord.chat_box.messages)) {
      return responseRecord.chat_box.messages as SupportChatMessageRecord[];
    }

    if (isRecord(responseRecord.data) && Array.isArray(responseRecord.data.messages)) {
      return responseRecord.data.messages as SupportChatMessageRecord[];
    }
  }

  return [] as SupportChatMessageRecord[];
}

export function getSupportChatBox(response: SupportChatBoxDetailResponse | undefined) {
  if (!response) {
    return null;
  }

  if (Array.isArray(response)) {
    return null;
  }

  const responseRecord = response as Record<string, unknown>;

  if (isRecord(responseRecord.chatBox)) {
    return responseRecord.chatBox as SupportChatBoxRecord;
  }

  if (isRecord(responseRecord.chat_box)) {
    return responseRecord.chat_box as SupportChatBoxRecord;
  }

  if (isRecord(responseRecord.data)) {
    return responseRecord.data as SupportChatBoxRecord;
  }

  return response as SupportChatBoxRecord;
}

export function getSupportChatConversationItems(
  response: SupportChatBoxesGroupedResponse | undefined,
): SupportChatBoxRecord[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return sortByUpdatedAtDesc(response);
  }

  const responseRecord = response as Record<string, unknown>;
  const directChatBoxes = toArray<SupportChatBoxRecord>(responseRecord.chatboxes);

  if (directChatBoxes.length) {
    return sortByUpdatedAtDesc(directChatBoxes);
  }

  const directGrouped = [
    ...toArray<SupportChatBoxRecord>(responseRecord.recent),
    ...toArray<SupportChatBoxRecord>(responseRecord.today),
    ...toArray<SupportChatBoxRecord>(responseRecord.yesterday),
    ...toArray<SupportChatBoxRecord>(responseRecord.past),
    ...toArray<SupportChatBoxRecord>(responseRecord.older),
    ...toArray<SupportChatBoxRecord>(responseRecord.items),
  ];

  if (directGrouped.length) {
    return sortByUpdatedAtDesc(directGrouped);
  }

  if (Array.isArray(responseRecord.data)) {
    return sortByUpdatedAtDesc(responseRecord.data as SupportChatBoxRecord[]);
  }

  if (isRecord(responseRecord.data)) {
    const nestedGrouped = [
      ...toArray<SupportChatBoxRecord>(responseRecord.data.recent),
      ...toArray<SupportChatBoxRecord>(responseRecord.data.today),
      ...toArray<SupportChatBoxRecord>(responseRecord.data.yesterday),
      ...toArray<SupportChatBoxRecord>(responseRecord.data.past),
      ...toArray<SupportChatBoxRecord>(responseRecord.data.older),
      ...toArray<SupportChatBoxRecord>(responseRecord.data.items),
    ];

    return sortByUpdatedAtDesc(nestedGrouped);
  }

  return [];
}

export function getFirstSupportChatBox(
  response: SupportChatBoxesGroupedResponse | undefined,
) {
  return getSupportChatConversationItems(response)[0] ?? null;
}

export function getSupportChatOtherParticipant(
  chatBox: SupportChatBoxRecord | null | undefined,
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

  const senderId = chatBox.senderId ?? chatBox.sender_id ?? getSupportChatParticipantId(chatBox.sender);
  const receiverId =
    chatBox.receiverId ?? chatBox.receiver_id ?? getSupportChatParticipantId(chatBox.receiver);

  if (currentUserId && senderId === currentUserId) {
    return chatBox.receiver ?? null;
  }

  if (currentUserId && receiverId === currentUserId) {
    return chatBox.sender ?? null;
  }

  return chatBox.receiver ?? chatBox.sender ?? null;
}

export function getSupportChatLastMessageText(chatBox: SupportChatBoxRecord) {
  if (chatBox.subtitle) {
    return chatBox.subtitle;
  }

  if (chatBox.latestMessage) {
    return chatBox.latestMessage;
  }

  const message = chatBox.lastMessage ?? chatBox.last_message;

  if (typeof message === 'string') {
    return message;
  }

  if (message) {
    return message.text ?? message.message ?? '';
  }

  const messages = chatBox.messages ?? [];
  const latest = messages[messages.length - 1];

  return latest?.text ?? latest?.message ?? '';
}

export function getSupportChatDateLabel(chatBox: SupportChatBoxRecord) {
  const ticketDate = chatBox.date;

  if (ticketDate?.day || ticketDate?.month) {
    return [ticketDate.day, ticketDate.month].filter(Boolean).join(' ');
  }

  return formatSupportChatDateLabel(
    chatBox.updatedAt ?? chatBox.updated_at ?? chatBox.createdAt ?? chatBox.created_at,
  );
}

export function getSupportChatAvatarLabel(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return 'SC';
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

export function getSupportChatAvatarTone(index: number) {
  return AVATAR_TONES[index % AVATAR_TONES.length];
}

export function formatSupportChatDateLabel(value?: string) {
  const date = parseSupportChatDate(value);

  if (!date) {
    return '';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return 'now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hr ago`;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatSupportChatTimeLabel(value?: string) {
  const date = parseSupportChatDate(value);

  if (!date) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    hour12: false,
    minute: '2-digit',
  }).format(date);
}
