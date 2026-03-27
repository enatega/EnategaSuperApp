import React from 'react';
import ChatComposer from '../chat/ChatComposer';

type Props = {
  onAttachmentPress: () => void;
  isSending?: boolean;
  onChangeText: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  value: string;
};

export default function RiderChatComposer({
  onAttachmentPress,
  isSending = false,
  onChangeText,
  onSend,
  placeholder,
  value,
}: Props) {
  return (
    <ChatComposer
      attachmentAccessibilityLabel="Add attachment"
      isSending={isSending}
      messageAccessibilityLabel="Send message"
      onAttachmentPress={onAttachmentPress}
      onChangeText={onChangeText}
      onSend={onSend}
      placeholder={placeholder}
      value={value}
    />
  );
}
