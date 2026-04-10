import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useSocketSession } from '../../../../general/hooks/useSocketSession';
import { socketClient } from '../../../../general/services/socket';
import type { SocketReceivedMessage } from '../../../../general/services/socket';
import { useTheme } from '../../../../general/theme/theme';
import { useSendRideChatMessage } from '../../hooks/useRideChatMutations';
import { useRideChatBoxes, useRideChatMessages } from '../../hooks/useRideChatQueries';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import RideChatFooter from './components/RideChatFooter';
import RideChatHeader from './components/RideChatHeader';
import RideChatMessageList from './components/RideChatMessageList';
import RideChatQuickReplies from './components/RideChatQuickReplies';
import type { RideChatMessageItem } from './types';
import {
  formatRideChatTimeLabel,
  getRideChatBoxId,
  getRideChatBoxes,
  getRideChatMessages,
  getRideChatParticipantId,
} from '../../utils/rideChatMappers';

type RiderChatRouteProp = RouteProp<RideSharingStackParamList, 'RiderChat'>;

export default function RiderChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const route = useRoute<RiderChatRouteProp>();
  const sessionQuery = useAuthSessionQuery();
  useSocketSession();
  const { driverAvatarUri, driverName, driverPhone, driverUserId } = route.params;
  const senderId = sessionQuery.data?.user?.id;
  const [draftMessage, setDraftMessage] = useState('');
  const [pendingMessages, setPendingMessages] = useState<RideChatMessageItem[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<RideChatMessageItem[]>([]);
  const [chatBoxId, setChatBoxId] = useState<string | undefined>();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const chatBoxesQuery = useRideChatBoxes(senderId ?? undefined);
  const chatBoxes = useMemo(() => getRideChatBoxes(chatBoxesQuery.data), [chatBoxesQuery.data]);
  const resolvedChatBoxId = useMemo(() => {
    if (chatBoxId) {
      return chatBoxId;
    }

    return (
      getRideChatBoxId(
        chatBoxes.find((box) => {
          const chatSenderId = getRideChatParticipantId(box.sender, box.senderId ?? box.sender_id);
          const chatReceiverId = getRideChatParticipantId(box.receiver, box.receiverId ?? box.receiver_id);

          return (
            (chatSenderId === senderId && chatReceiverId === driverUserId)
            || (chatSenderId === driverUserId && chatReceiverId === senderId)
            || box.participants?.includes(driverUserId)
          );
        }) ?? null,
      ) ?? undefined
    );
  }, [chatBoxId, chatBoxes, driverUserId, senderId]);
  const chatMessagesQuery = useRideChatMessages(resolvedChatBoxId);

  const sendMessageMutation = useSendRideChatMessage({
    onError: (error) => {
      setPendingMessages((current) => current.slice(0, -1));
      showToast.error(t('ride_chat_send_error_title'), error.message || t('ride_chat_send_error_message'));
    },
    onSuccess: (response) => {
      const nextChatBoxId = response.chatBoxId ?? resolvedChatBoxId;

      if (response.chatBoxId) {
        setChatBoxId(response.chatBoxId);
      }

      setDraftMessage('');
      void chatBoxesQuery.refetch();

      if (nextChatBoxId) {
        void chatMessagesQuery.refetch();
      }
    },
  });

  useEffect(() => {
    const serverMessages = getRideChatMessages(chatMessagesQuery.data);

    if (serverMessages.length > 0 && pendingMessages.length > 0) {
      setPendingMessages([]);
    }
  }, [chatMessagesQuery.data, pendingMessages.length]);

  const conversationMessages = useMemo(() => {
    return getRideChatMessages(chatMessagesQuery.data).map((message, index) => {
      const messageSenderId = getRideChatParticipantId(
        message.sender,
        message.senderId ?? message.sender_id,
      );

      return {
        id: message.id ?? `${message.createdAt ?? message.created_at ?? 'message'}-${index}`,
        isCurrentUser: messageSenderId === senderId,
        text: message.text ?? '',
        timeLabel: formatRideChatTimeLabel(message.createdAt ?? message.created_at),
      };
    });
  }, [chatMessagesQuery.data, senderId]);

  useEffect(() => {
    setRealtimeMessages((current) => {
      const nextMessages = current.filter((item) => !conversationMessages.some(
        (serverMessage) =>
          serverMessage.isCurrentUser === item.isCurrentUser
          && serverMessage.text === item.text,
      ));

      return nextMessages.length === current.length ? current : nextMessages;
    });
  }, [conversationMessages]);

  const hasRealMessages =
    conversationMessages.length > 0
    || realtimeMessages.length > 0
    || pendingMessages.length > 0;

  const messages = useMemo(() => {
    if (!hasRealMessages) {
      return [
        {
          id: 'ride-chat-auto-message',
          isCurrentUser: false,
          text: t('ride_chat_auto_message'),
          timeLabel: t('ride_chat_auto_time'),
        },
      ];
    }

    return [...conversationMessages, ...realtimeMessages, ...pendingMessages];
  }, [conversationMessages, hasRealMessages, pendingMessages, realtimeMessages, t]);

  const quickReplies = useMemo(
    () => [
      t('ride_chat_quick_reply_here'),
      t('ride_chat_quick_reply_hello'),
      t('ride_chat_quick_reply_call_arrive'),
      t('ride_chat_quick_reply_where'),
      t('ride_chat_quick_reply_eta'),
    ],
    [t],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    });
  }, [messages.length]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!senderId || !driverUserId) {
      return undefined;
    }

    return socketClient.onReceiveMessage((message: SocketReceivedMessage) => {
      const isConversationMessage =
        message.receiver === senderId && message.sender === driverUserId;

      if (!isConversationMessage) {
        return;
      }

      setRealtimeMessages((current) => {
        const alreadyExists = current.some(
          (item) => !item.isCurrentUser && item.text === message.text,
        );

        if (alreadyExists) {
          return current;
        }

        return [
          ...current,
          {
            id: `realtime-${Date.now()}`,
            isCurrentUser: false,
            text: message.text,
            timeLabel: formatRideChatTimeLabel(new Date().toISOString()),
          },
        ];
      });

      void chatBoxesQuery.refetch();
      if (resolvedChatBoxId) {
        void chatMessagesQuery.refetch();
      }
    });
  }, [
    chatBoxesQuery,
    chatMessagesQuery,
    driverUserId,
    resolvedChatBoxId,
    senderId,
  ]);

  const appendMessage = useCallback((messageText: string) => {
    const trimmed = messageText.trim();

    if (!trimmed) {
      return;
    }

    if (!senderId) {
      showToast.error(t('ride_chat_send_error_title'), t('ride_chat_missing_session_error'));
      return;
    }

    if (!driverUserId) {
      showToast.error(t('ride_chat_send_error_title'), t('ride_chat_missing_receiver_error'));
      return;
    }

    setPendingMessages((current) => [
      ...current,
      {
        id: `pending-${Date.now()}`,
        isCurrentUser: true,
        text: trimmed,
        timeLabel: formatRideChatTimeLabel(new Date().toISOString()),
      },
    ]);

    sendMessageMutation.mutate({
      senderId,
      receiverId: driverUserId,
      text: trimmed,
    });
  }, [driverUserId, senderId, sendMessageMutation, t]);

  const handleAttachmentPress = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showToast.error(
        t('ride_chat_attachment_permission_title'),
        t('ride_chat_attachment_permission_message'),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];

    showToast.success(
      t('ride_chat_attachment_selected_title'),
      t('ride_chat_attachment_selected_message', {
        fileName: asset.fileName ?? asset.uri.split('/').pop() ?? 'image',
      }),
    );
  }, [t]);

  const handleCallPress = useCallback(async () => {
    if (!driverPhone) {
      showToast.info(t('ride_active_driver_contact_unavailable'));
      return;
    }

    try {
      await Linking.openURL(`tel:${driverPhone}`);
    } catch {
      showToast.error(t('ride_active_dialer_unavailable'));
    }
  }, [driverPhone, t]);

  const showLoadingState = chatBoxesQuery.isPending || Boolean(resolvedChatBoxId && chatMessagesQuery.isPending);
  const showErrorState = chatBoxesQuery.isError || chatMessagesQuery.isError;
  const errorMessage = chatBoxesQuery.error?.message ?? chatMessagesQuery.error?.message;
  const shouldShowQuickReplies = !hasRealMessages && !isKeyboardVisible;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <RideChatHeader
        driverAvatarUri={driverAvatarUri}
        driverName={driverName}
        onCallPress={handleCallPress}
      />

      <KeyboardAvoidingView
        style={styles.chatLayout}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10   : 0}
      >
        <RideChatMessageList
          errorMessage={showErrorState ? errorMessage ?? t('ride_chat_send_error_message') : undefined}
          isLoading={showLoadingState}
          messages={messages}
          scrollViewRef={scrollViewRef}
        />

        {shouldShowQuickReplies ? (
          <RideChatQuickReplies
            disabled={sendMessageMutation.isPending}
            onPressReply={appendMessage}
            replies={quickReplies}
          />
        ) : null}

        <View style={styles.footerWrap}>
          <RideChatFooter
            attachmentAccessibilityLabel={t('ride_chat_add_attachment')}
            bottomInset={insets.bottom}
            isKeyboardVisible={isKeyboardVisible}
            isSending={sendMessageMutation.isPending}
            messageAccessibilityLabel={t('ride_chat_send_message')}
            onAttachmentPress={handleAttachmentPress}
            onChangeText={setDraftMessage}
            onSend={() => appendMessage(draftMessage)}
            placeholder={t('ride_chat_input_placeholder')}
            value={draftMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatLayout: {
    flex: 1,
  },
  footerWrap: {
    justifyContent: 'flex-end',
  },
  screen: {
    flex: 1,
  },
});
