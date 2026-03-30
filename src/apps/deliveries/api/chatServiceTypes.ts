export type SendDeliveryChatMessagePayload = {
  senderId: string;
  receiverId: string;
  text: string;
};

export type DeliveryChatParticipant = {
  id?: string;
  name?: string;
  fullName?: string;
};

export type DeliveryChatMessageRecord = {
  id?: string;
  chatBoxId?: string;
  chat_box_id?: string;
  senderId?: string;
  sender_id?: string;
  receiverId?: string;
  receiver_id?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
  sender?: DeliveryChatParticipant;
  receiver?: DeliveryChatParticipant;
};

export type SendDeliveryChatMessageResponse = {
  message?: string;
  chatBoxId?: string;
};

export type DeliveryChatBoxRecord = {
  id?: string;
  chatBoxId?: string;
  senderId?: string;
  receiverId?: string;
  userId?: string;
  lastMessage?: DeliveryChatMessageRecord | string;
  updatedAt?: string;
  createdAt?: string;
  sender?: DeliveryChatParticipant;
  receiver?: DeliveryChatParticipant;
};

export type DeliveryChatBoxesResponse =
  | DeliveryChatBoxRecord[]
  | {
      data?: DeliveryChatBoxRecord[] | { items?: DeliveryChatBoxRecord[] };
      message?: string;
      success?: boolean;
    };

export type DeliveryChatMessagesResponse =
  | DeliveryChatMessageRecord[]
  | {
      messages?: DeliveryChatMessageRecord[];
      data?: DeliveryChatMessageRecord[] | { items?: DeliveryChatMessageRecord[] };
      otherUser?: DeliveryChatParticipant & {
        email?: string;
        phone?: string;
        profile?: string;
      };
      message?: string;
      success?: boolean;
    };
