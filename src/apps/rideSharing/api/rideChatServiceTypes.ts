export type SendRideChatMessagePayload = {
  senderId: string;
  receiverId: string;
  text: string;
};

export type RideChatParticipant = {
  id?: string;
  name?: string;
  fullName?: string;
  phone?: string;
  profile?: string;
};

export type RideChatMessageRecord = {
  id?: string;
  chatBoxId?: string;
  chat_box_id?: string;
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  text?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  sender?: RideChatParticipant;
  receiver?: RideChatParticipant;
};

export type SendRideChatMessageResponse = {
  message?: string;
  chatBoxId?: string;
};

export type RideChatBoxRecord = {
  id?: string;
  chatBoxId?: string;
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  participants?: string[];
  lastMessage?: RideChatMessageRecord | string;
  updatedAt?: string;
  createdAt?: string;
  sender?: RideChatParticipant;
  receiver?: RideChatParticipant;
};

export type RideChatBoxesResponse =
  | RideChatBoxRecord[]
  | {
      data?: RideChatBoxRecord[] | { items?: RideChatBoxRecord[] };
      chatList?: RideChatBoxRecord[];
      message?: string;
      success?: boolean;
    };

export type RideChatMessagesResponse =
  | RideChatMessageRecord[]
  | {
      messages?: RideChatMessageRecord[];
      data?: RideChatMessageRecord[] | { items?: RideChatMessageRecord[] };
      otherUser?: RideChatParticipant;
      message?: string;
      success?: boolean;
    };
