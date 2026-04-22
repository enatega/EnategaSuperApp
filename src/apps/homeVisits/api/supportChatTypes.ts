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
  data?: {
    admins?: SupportAdminRecord[];
  };
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
  subtitle?: string;
  date?: {
    day?: string;
    month?: string;
  };
  orderId?: string | null;
  order_id?: string | null;
  status?:
    | string
    | {
        key?: string;
        label?: string;
      };
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  userId?: string;
  user_id?: string;
  title?: string;
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

export type SupportChatBoxesGroupedResponse =
  | SupportChatBoxRecord[]
  | {
      count?: number;
      chatboxes?: SupportChatBoxRecord[];
      data?:
        | {
            today?: SupportChatBoxRecord[];
            recent?: SupportChatBoxRecord[];
            yesterday?: SupportChatBoxRecord[];
            older?: SupportChatBoxRecord[];
            past?: SupportChatBoxRecord[];
            items?: SupportChatBoxRecord[];
          }
        | SupportChatBoxRecord[]
        | {
            items?: SupportChatBoxRecord[];
          };
      today?: SupportChatBoxRecord[];
      recent?: SupportChatBoxRecord[];
      yesterday?: SupportChatBoxRecord[];
      older?: SupportChatBoxRecord[];
      past?: SupportChatBoxRecord[];
      items?: SupportChatBoxRecord[];
      message?: string;
      success?: boolean;
    };
