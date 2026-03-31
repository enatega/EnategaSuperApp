export type RiderChatSender = 'rider' | 'user';

export type RiderChatMessage = {
  id: string;
  sender: RiderChatSender;
  text: string;
  timeLabel?: string;
};
