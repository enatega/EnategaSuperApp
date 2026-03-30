import React from 'react';
import ChatMessageBubble from '../chat/ChatMessageBubble';

type Props = {
  sender: 'rider' | 'user';
  text: string;
  timeLabel?: string;
};

export default function RiderChatMessageBubble({ sender, text, timeLabel }: Props) {
  return (
    <ChatMessageBubble
      isCurrentUser={sender === 'user'}
      text={text}
      timeLabel={timeLabel}
    />
  );
}
