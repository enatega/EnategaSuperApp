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
  senderId?: string;
  receiverId?: string;
  text?: string;
  createdAt?: string;
  sender?: DeliveryChatParticipant;
  receiver?: DeliveryChatParticipant;
};

export type SendDeliveryChatMessageResponse = {
  success?: boolean;
  message?: string;
  data?: DeliveryChatMessageRecord;
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
      data?: DeliveryChatMessageRecord[] | { items?: DeliveryChatMessageRecord[] };
      message?: string;
      success?: boolean;
    };
