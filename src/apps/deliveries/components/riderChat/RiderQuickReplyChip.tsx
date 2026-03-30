import React from 'react';
import ChatQuickReplyChip from '../chat/ChatQuickReplyChip';

type Props = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

export default function RiderQuickReplyChip({ disabled = false, label, onPress }: Props) {
  return (
    <ChatQuickReplyChip
      disabled={disabled}
      label={label}
      onPress={onPress}
    />
  );
}
