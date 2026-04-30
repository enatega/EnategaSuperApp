import type {
  SupportChatBoxRecord,
  SupportChatBoxesGroupedResponse,
  SupportChatParticipant,
} from '../api/supportChatTypes';

const AVATAR_TONES = ['cardPeach', 'cardBlue', 'cardMint', 'cardLavender', 'primaryDark'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function sortByUpdatedAtDesc(items: SupportChatBoxRecord[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(
      left.updatedAt ?? left.updated_at ?? left.createdAt ?? left.created_at ?? 0,
    ).getTime();
    const rightTime = new Date(
      right.updatedAt ?? right.updated_at ?? right.createdAt ?? right.created_at ?? 0,
    ).getTime();

    return rightTime - leftTime;
  });
}

export function getSupportChatBoxId(chatBox: SupportChatBoxRecord | null | undefined) {
  if (!chatBox) {
    return '';
  }

  return chatBox.id ?? chatBox._id ?? chatBox.chatBoxId ?? chatBox.chat_box_id ?? '';
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
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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
