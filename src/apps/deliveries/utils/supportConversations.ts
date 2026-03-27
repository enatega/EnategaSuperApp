export type SupportConversationId =
  | 'barbarella_inova_recent'
  | 'barbarella_nova_recent'
  | 'barbarella_nova_past_a'
  | 'barbarella_nova_past_b'
  | 'barbarella_nova_past_c';

export type SupportConversation = {
  id: SupportConversationId;
  avatarLabel: string;
  avatarTone: 'cardPeach' | 'cardBlue' | 'cardMint' | 'cardLavender' | 'primaryDark';
  dateKey: string;
  messageKey: string;
  nameKey: string;
  unreadCount?: number;
};

export const recentSupportConversations: SupportConversation[] = [
  {
    id: 'barbarella_inova_recent',
    avatarLabel: 'BI',
    avatarTone: 'cardPeach',
    dateKey: 'support_conversations_time_5m',
    messageKey: 'support_conversations_preview_let_me_check',
    nameKey: 'support_conversations_name_barbarella_inova',
    unreadCount: 2,
  },
  {
    id: 'barbarella_nova_recent',
    avatarLabel: 'BN',
    avatarTone: 'cardBlue',
    dateKey: 'support_conversations_time_1h',
    messageKey: 'support_conversations_preview_take_a_look',
    nameKey: 'support_conversations_name_barbarella_nova',
  },
];

export const pastSupportConversations: SupportConversation[] = [
  {
    id: 'barbarella_nova_past_a',
    avatarLabel: 'BN',
    avatarTone: 'cardMint',
    dateKey: 'support_conversations_time_oct_2',
    messageKey: 'support_conversations_preview_take_a_look',
    nameKey: 'support_conversations_name_barbarella_nova',
  },
  {
    id: 'barbarella_nova_past_b',
    avatarLabel: 'BN',
    avatarTone: 'cardLavender',
    dateKey: 'support_conversations_time_oct_2',
    messageKey: 'support_conversations_preview_take_a_look',
    nameKey: 'support_conversations_name_barbarella_nova',
  },
  {
    id: 'barbarella_nova_past_c',
    avatarLabel: 'BN',
    avatarTone: 'primaryDark',
    dateKey: 'support_conversations_time_oct_2',
    messageKey: 'support_conversations_preview_take_a_look',
    nameKey: 'support_conversations_name_barbarella_nova',
  },
];
