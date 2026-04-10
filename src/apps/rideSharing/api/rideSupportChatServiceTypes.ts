export type SendRideSupportChatMessagePayload = {
  senderId: string;
  text: string;
  chatBoxId?: string;
  receiverId?: string;
};

export type RideSupportChatParticipant = {
  id?: string;
  name?: string;
  fullName?: string;
  full_name?: string;
  phone?: string;
  profile?: string;
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

export type RideSupportChatMessagesResponse =
  | RideSupportChatMessageRecord[]
  | {
      messages?: RideSupportChatMessageRecord[];
      data?: RideSupportChatMessageRecord[] | { items?: RideSupportChatMessageRecord[] };
      otherUser?: RideSupportChatParticipant;
      message?: string;
      success?: boolean;
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
