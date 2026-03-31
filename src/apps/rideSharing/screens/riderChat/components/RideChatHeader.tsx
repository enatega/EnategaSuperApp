import React from 'react';
import { useTranslation } from 'react-i18next';
import ChatConversationHeader from '../../../../../general/components/chat/ChatConversationHeader';

type Props = {
  driverAvatarUri?: string | null;
  driverName: string;
  onCallPress: () => void;
};

export default function RideChatHeader({ driverAvatarUri, driverName, onCallPress }: Props) {
  const { t } = useTranslation('rideSharing');

  return (
    <ChatConversationHeader
      avatarUri={driverAvatarUri}
      backAccessibilityLabel={t('back_button')}
      onRightPress={onCallPress}
      rightAccessibilityLabel={t('ride_chat_call_action')}
      title={driverName}
    />
  );
}
