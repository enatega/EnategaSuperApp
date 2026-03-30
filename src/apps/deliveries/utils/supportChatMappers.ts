import type {
  SupportChatBoxDetailResponse,
  SupportChatBoxRecord,
  SupportChatBoxesGroupedResponse,
  SupportChatMessageRecord,
  SupportChatMessagesResponse,
  SupportChatParticipant,
} from '../api/supportChatTypes';

export type SupportChatConversationGroup = {
  past: SupportChatBoxRecord[];
  recent: SupportChatBoxRecord[];
};

const AVATAR_TONES = ['cardPeach', 'cardBlue', 'cardMint', 'cardLavender', 'primaryDark'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function sortByUpdatedAtDesc(items: SupportChatBoxRecord[]) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.updatedAt ?? left.updated_at ?? left.createdAt ?? left.created_at ?? 0).getTime();
    const rightTime = new Date(right.updatedAt ?? right.updated_at ?? right.createdAt ?? right.created_at ?? 0).getTime();

    return rightTime - leftTime;
  });
}

function flattenBuckets(buckets: SupportChatConversationGroup) {
  return [...buckets.recent, ...buckets.past];
}

export function getSupportChatBoxId(chatBox: SupportChatBoxRecord | null | undefined) {
  if (!chatBox) {
    return '';
  }

  return chatBox.id ?? chatBox._id ?? chatBox.chatBoxId ?? chatBox.chat_box_id ?? '';
}

export function getSupportChatMessageId(message: SupportChatMessageRecord) {
  return message.id ?? message._id ?? `${message.createdAt ?? message.created_at ?? 'message'}-${message.text ?? message.message ?? ''}`;
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

  return participant.fullName ?? participant.full_name ?? participant.name ?? participant.email ?? participant.phone ?? '';
}

export function getSupportChatMessages(response: SupportChatMessagesResponse | SupportChatBoxDetailResponse | undefined) {
  if (!response) {
    return [] as SupportChatMessageRecord[];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (isRecord(response)) {
    const responseRecord = response as Record<string, unknown>;

    if (Array.isArray(responseRecord.messages)) {
      return responseRecord.messages as SupportChatMessageRecord[];
    }

    if (Array.isArray(responseRecord.data)) {
      return responseRecord.data as SupportChatMessageRecord[];
    }

    if (isRecord(responseRecord.data) && Array.isArray(responseRecord.data.items)) {
      return responseRecord.data.items as SupportChatMessageRecord[];
    }

    if (isRecord(responseRecord.chatBox) && Array.isArray(responseRecord.chatBox.messages)) {
      return responseRecord.chatBox.messages as SupportChatMessageRecord[];
    }

    if (isRecord(responseRecord.chat_box) && Array.isArray(responseRecord.chat_box.messages)) {
      return responseRecord.chat_box.messages as SupportChatMessageRecord[];
    }

    if (Array.isArray(responseRecord.messages)) {
      return responseRecord.messages as SupportChatMessageRecord[];
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

export function getSupportChatConversationGroups(
  response: SupportChatBoxesGroupedResponse | undefined,
): SupportChatConversationGroup {
  if (!response) {
    return { past: [], recent: [] };
  }

  if (Array.isArray(response)) {
    const sorted = sortByUpdatedAtDesc(response);
    return {
      recent: sorted.slice(0, 2),
      past: sorted.slice(2),
    };
  }

  const responseRecord = response as Record<string, unknown>;
  const directChatBoxes = toArray<SupportChatBoxRecord>(responseRecord.chatboxes);
  const directRecent = toArray<SupportChatBoxRecord>(responseRecord.recent);
  const directToday = toArray<SupportChatBoxRecord>(responseRecord.today);
  const directYesterday = toArray<SupportChatBoxRecord>(responseRecord.yesterday);
  const directPast = toArray<SupportChatBoxRecord>(responseRecord.past);
  const directOlder = toArray<SupportChatBoxRecord>(responseRecord.older);

  if (directChatBoxes.length) {
    const sorted = sortByUpdatedAtDesc(directChatBoxes);
    return {
      recent: sorted.slice(0, 2),
      past: sorted.slice(2),
    };
  }

  if (directRecent.length || directToday.length || directYesterday.length || directPast.length || directOlder.length) {
    return {
      recent: sortByUpdatedAtDesc([...directRecent, ...directToday, ...directYesterday]),
      past: sortByUpdatedAtDesc([...directPast, ...directOlder]),
    };
  }

  if (Array.isArray(responseRecord.items)) {
    const sorted = sortByUpdatedAtDesc(responseRecord.items as SupportChatBoxRecord[]);
    return {
      recent: sorted.slice(0, 2),
      past: sorted.slice(2),
    };
  }

  if (Array.isArray(responseRecord.data)) {
    const sorted = sortByUpdatedAtDesc(responseRecord.data as SupportChatBoxRecord[]);
    return {
      recent: sorted.slice(0, 2),
      past: sorted.slice(2),
    };
  }

  if (isRecord(responseRecord.data)) {
    const dataRecent = toArray<SupportChatBoxRecord>(responseRecord.data.recent);
    const dataToday = toArray<SupportChatBoxRecord>(responseRecord.data.today);
    const dataYesterday = toArray<SupportChatBoxRecord>(responseRecord.data.yesterday);
    const dataPast = toArray<SupportChatBoxRecord>(responseRecord.data.past);
    const dataOlder = toArray<SupportChatBoxRecord>(responseRecord.data.older);

    if (dataRecent.length || dataToday.length || dataYesterday.length || dataPast.length || dataOlder.length) {
      return {
        recent: sortByUpdatedAtDesc([...dataRecent, ...dataToday, ...dataYesterday]),
        past: sortByUpdatedAtDesc([...dataPast, ...dataOlder]),
      };
    }

    if (Array.isArray(responseRecord.data.items)) {
      const sorted = sortByUpdatedAtDesc(responseRecord.data.items as SupportChatBoxRecord[]);
      return {
        recent: sorted.slice(0, 2),
        past: sorted.slice(2),
      };
    }
  }

  return { past: [], recent: [] };
}

export function getFirstSupportChatBox(response: SupportChatBoxesGroupedResponse | undefined) {
  const groups = getSupportChatConversationGroups(response);
  return flattenBuckets(groups)[0] ?? null;
}

export function getSupportChatOtherParticipant(chatBox: SupportChatBoxRecord | null | undefined, currentUserId?: string) {
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
  const receiverId = chatBox.receiverId ?? chatBox.receiver_id ?? getSupportChatParticipantId(chatBox.receiver);

  if (currentUserId && senderId === currentUserId) {
    return chatBox.receiver ?? null;
  }

  if (currentUserId && receiverId === currentUserId) {
    return chatBox.sender ?? null;
  }

  return chatBox.receiver ?? chatBox.sender ?? null;
}

export function getSupportChatLastMessageText(chatBox: SupportChatBoxRecord) {
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

export function getSupportChatUpdatedAt(chatBox: SupportChatBoxRecord) {
  return chatBox.updatedAt ?? chatBox.updated_at ?? chatBox.createdAt ?? chatBox.created_at ?? '';
}

export function getSupportChatAvatarLabel(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

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

export function formatSupportChatTimeLabel(value?: string) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
