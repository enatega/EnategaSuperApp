import React from 'react';
import { useTranslation } from 'react-i18next';
import ChatConversationHeader from '../../../../general/components/chat/ChatConversationHeader';

type Props = {
  riderName: string;
  riderAvatarUri?: string | null;
  onCallPress?: () => void;
};

export default function RiderChatHeader({ riderName, riderAvatarUri, onCallPress }: Props) {
  const { t } = useTranslation('deliveries');

  return (
    <ChatConversationHeader
      avatarUri={riderAvatarUri}
      backAccessibilityLabel={t('support_back_action')}
      onRightPress={onCallPress}
      rightAccessibilityLabel={t('rider_chat_call_action')}
      title={riderName}
    />
  );
}
