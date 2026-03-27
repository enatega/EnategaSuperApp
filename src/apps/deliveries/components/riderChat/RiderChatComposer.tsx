import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('deliveries');

  return (
    <ChatComposer
      attachmentAccessibilityLabel={t('rider_chat_add_attachment')}
      isSending={isSending}
      messageAccessibilityLabel={t('rider_chat_send_message')}
      onAttachmentPress={onAttachmentPress}
      onChangeText={onChangeText}
      onSend={onSend}
      placeholder={placeholder}
      value={value}
    />
  );
}
