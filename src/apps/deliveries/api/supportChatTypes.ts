export type SupportChatParticipant = {
  id?: string;
  userId?: string;
  fullName?: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  profile?: string;
  type?: string;
};

export type SupportAdminRecord = {
  id: string;
  name: string;
  image?: string;
  type?: string;
};

export type SupportAdminsResponse = {
  count?: number;
  admins?: SupportAdminRecord[];
};

export type SupportChatMessageRecord = {
  id?: string;
  _id?: string;
  chatBoxId?: string;
  chat_box_id?: string;
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  text?: string;
  message?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  sender?: SupportChatParticipant;
  receiver?: SupportChatParticipant;
};

export type SupportChatBoxRecord = {
  id?: string;
  _id?: string;
  chatBoxId?: string;
  chat_box_id?: string;
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  userId?: string;
  user_id?: string;
  title?: string;
  status?: string;
  updatedAt?: string;
  updated_at?: string;
  createdAt?: string;
  created_at?: string;
  unreadCount?: number;
  unread_count?: number;
  latestMessage?: string;
  lastMessage?: SupportChatMessageRecord | string;
  last_message?: SupportChatMessageRecord | string;
  messages?: SupportChatMessageRecord[];
  sender?: SupportChatParticipant;
  receiver?: SupportChatParticipant;
  admin?: SupportChatParticipant;
  otherUser?: SupportChatParticipant;
  other_user?: SupportChatParticipant;
};

export type SupportChatGroupedBuckets = {
  today?: SupportChatBoxRecord[];
  recent?: SupportChatBoxRecord[];
  yesterday?: SupportChatBoxRecord[];
  older?: SupportChatBoxRecord[];
  past?: SupportChatBoxRecord[];
  items?: SupportChatBoxRecord[];
};

export type SupportChatBoxesGroupedResponse =
  | SupportChatBoxRecord[]
  | {
      count?: number;
      chatboxes?: SupportChatBoxRecord[];
      data?: SupportChatGroupedBuckets | SupportChatBoxRecord[] | { items?: SupportChatBoxRecord[] };
      today?: SupportChatBoxRecord[];
      recent?: SupportChatBoxRecord[];
      yesterday?: SupportChatBoxRecord[];
      older?: SupportChatBoxRecord[];
      past?: SupportChatBoxRecord[];
      items?: SupportChatBoxRecord[];
      message?: string;
      success?: boolean;
    };

export type SupportChatBoxDetailResponse =
  | SupportChatBoxRecord
  | {
      data?: SupportChatBoxRecord;
      chatBox?: SupportChatBoxRecord;
      chat_box?: SupportChatBoxRecord;
      messages?: SupportChatMessageRecord[];
      sender?: SupportChatParticipant;
      receiver?: SupportChatParticipant;
      otherUser?: SupportChatParticipant;
      message?: string;
      success?: boolean;
    };

export type SupportChatMessagesResponse =
  | SupportChatMessageRecord[]
  | {
      messages?: SupportChatMessageRecord[];
      data?: SupportChatMessageRecord[] | { items?: SupportChatMessageRecord[] };
      otherUser?: SupportChatParticipant;
      message?: string;
      success?: boolean;
    };

export type SendSupportChatMessagePayload = {
  senderId: string;
  receiverId: string;
  text: string;
  chatBoxId?: string;
};

export type SendSupportChatMessageResponse = {
  message?: string;
  chatBoxId?: string;
  data?: {
    chatBoxId?: string;
    id?: string;
  };
  detail?: {
    id?: string;
    senderId?: string;
    sender_id?: string;
    receiverId?: string;
    receiver_id?: string;
    text?: string;
    chatBoxId?: string;
    chat_box_id?: string;
    createdAt?: string;
    created_at?: string;
    updatedAt?: string;
    updated_at?: string;
  };
};
