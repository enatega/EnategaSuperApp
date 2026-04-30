export type RideSupportChatParticipant = {
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

export type RideSupportChatMessageRecord = {
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
  sender?: RideSupportChatParticipant;
  receiver?: RideSupportChatParticipant;
};

export type RideSupportChatBoxRecord = {
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
  lastMessage?: RideSupportChatMessageRecord | string;
  last_message?: RideSupportChatMessageRecord | string;
  messages?: RideSupportChatMessageRecord[];
  sender?: RideSupportChatParticipant;
  receiver?: RideSupportChatParticipant;
  admin?: RideSupportChatParticipant;
  otherUser?: RideSupportChatParticipant;
  other_user?: RideSupportChatParticipant;
};

export type RideSupportChatGroupedBuckets = {
  today?: RideSupportChatBoxRecord[];
  recent?: RideSupportChatBoxRecord[];
  yesterday?: RideSupportChatBoxRecord[];
  older?: RideSupportChatBoxRecord[];
  past?: RideSupportChatBoxRecord[];
  items?: RideSupportChatBoxRecord[];
};

export type RideSupportChatBoxesGroupedResponse =
  | RideSupportChatBoxRecord[]
  | {
      count?: number;
      chatboxes?: RideSupportChatBoxRecord[];
      data?: RideSupportChatGroupedBuckets | RideSupportChatBoxRecord[] | { items?: RideSupportChatBoxRecord[] };
      today?: RideSupportChatBoxRecord[];
      recent?: RideSupportChatBoxRecord[];
      yesterday?: RideSupportChatBoxRecord[];
      older?: RideSupportChatBoxRecord[];
      past?: RideSupportChatBoxRecord[];
      items?: RideSupportChatBoxRecord[];
      message?: string;
      success?: boolean;
    };

export type RideSupportChatBoxDetailResponse =
  | RideSupportChatBoxRecord
  | {
      data?: RideSupportChatBoxRecord;
      chatBox?: RideSupportChatBoxRecord;
      chat_box?: RideSupportChatBoxRecord;
      messages?: RideSupportChatMessageRecord[];
      sender?: RideSupportChatParticipant;
      receiver?: RideSupportChatParticipant;
      otherUser?: RideSupportChatParticipant;
      message?: string;
      success?: boolean;
    };

export type RideSupportChatMessagesResponse =
  | RideSupportChatMessageRecord[]
  | {
      messages?: RideSupportChatMessageRecord[];
      data?: RideSupportChatMessageRecord[] | { items?: RideSupportChatMessageRecord[] };
      otherUser?: RideSupportChatParticipant;
      message?: string;
      success?: boolean;
    };

export type SendRideSupportChatMessagePayload = {
  senderId: string;
  receiverId: string;
  text: string;
  chatBoxId?: string;
};

export type SendRideSupportChatMessageToChatBoxPayload = {
  senderId: string;
  chatBoxId?: string;
  text: string;
};

export type SendRideSupportChatMessageResponse = {
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
