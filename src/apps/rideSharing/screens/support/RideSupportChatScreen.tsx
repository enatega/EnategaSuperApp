import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import ChatMessageBubble from '../../../../general/components/chat/ChatMessageBubble';
import ChatQuickReplyChip from '../../../../general/components/chat/ChatQuickReplyChip';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import RideChatFooter from '../riderChat/components/RideChatFooter';
import { useSendRideSupportChatMessage } from '../../hooks/useRideSupportChatMutations';
import { useRideSupportChatMessages } from '../../hooks/useRideSupportChatQueries';
import {
  getRideSupportChatMessageId,
  getRideSupportChatMessages,
  getRideSupportChatParticipantId,
} from '../../utils/rideSupportChatMappers';
import { formatRideChatTimeLabel } from '../../utils/rideChatMappers';

type RouteProps = RouteProp<RideSharingStackParamList, 'RideSupportChat'>;

type SupportMessageItem = {
  id: string;
  isCurrentUser: boolean;
  text: string;
  timeLabel?: string;
};

export default function RideSupportChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProps>();
  const sessionQuery = useAuthSessionQuery();
  const senderId = sessionQuery.data?.user?.id;
  const [draftMessage, setDraftMessage] = useState('');
  const [chatBoxId, setChatBoxId] = useState(route.params?.chatBoxId);
  const [pendingMessages, setPendingMessages] = useState<SupportMessageItem[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const chatMessagesQuery = useRideSupportChatMessages(chatBoxId);
  const receiverId = route.params?.receiverId;

  const sendMessageMutation = useSendRideSupportChatMessage({
    onError: (error) => {
      setPendingMessages((current) => current.slice(0, -1));
      showToast.error(t('ride_support_chat_send_error_title'), error.message || t('ride_support_chat_send_error_message'));
    },
    onSuccess: (response) => {
      const nextChatBoxId =
        response.chatBoxId ??
        response.data?.chatBoxId ??
        response.detail?.chatBoxId ??
        response.detail?.chat_box_id;

      if (nextChatBoxId) {
        setChatBoxId(nextChatBoxId);
      }

      setDraftMessage('');
      void chatMessagesQuery.refetch();
    },
  });

  useEffect(() => {
    if (!chatBoxId && route.params?.chatBoxId) {
      setChatBoxId(route.params.chatBoxId);
    }
  }, [chatBoxId, route.params?.chatBoxId]);

  useEffect(() => {
    const serverMessages = getRideSupportChatMessages(chatMessagesQuery.data);

    if (serverMessages.length > 0 && pendingMessages.length > 0) {
      setPendingMessages([]);
    }
  }, [chatMessagesQuery.data, pendingMessages.length]);

  const conversationMessages = useMemo(() => {
    return getRideSupportChatMessages(chatMessagesQuery.data).map((message, index) => {
      const messageSenderId = getRideSupportChatParticipantId(
        message.sender,
        message.senderId ?? message.sender_id,
      );

      return {
        id: getRideSupportChatMessageId(message, index),
        isCurrentUser: messageSenderId === senderId,
        text: message.text ?? message.message ?? '',
        timeLabel: formatRideChatTimeLabel(message.createdAt ?? message.created_at),
      };
    });
  }, [chatMessagesQuery.data, senderId]);

  const messages = useMemo(
    () => [...conversationMessages, ...pendingMessages],
    [conversationMessages, pendingMessages],
  );

  const quickReplies = useMemo(
    () => [
      t('ride_support_chat_quick_reply_help'),
      t('ride_support_chat_quick_reply_issue'),
      t('ride_support_chat_quick_reply_payment'),
      t('ride_support_chat_quick_reply_driver'),
    ],
    [t],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: messages.length > 0 });
    });
  }, [messages]);

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

  const appendMessage = useCallback((text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    if (!senderId) {
      showToast.error(t('ride_support_chat_send_error_title'), t('ride_chat_missing_session_error'));
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
      receiverId,
      text: trimmed,
      chatBoxId,
    });
  }, [chatBoxId, receiverId, senderId, sendMessageMutation, t]);

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

  const shouldShowQuickReplies = !messages.length && !isKeyboardVisible;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('ride_support_chat_title')} />

      <KeyboardAvoidingView
        style={styles.chatLayout}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {chatMessagesQuery.isPending ? (
            <View style={styles.centerState}>
              <ChatMessageBubble
                isCurrentUser={false}
                text={t('ride_chat_loading')}
              />
            </View>
          ) : messages.length ? (
            <View style={styles.messageSection}>
              {messages.map((message) => (
                <ChatMessageBubble
                  key={message.id}
                  isCurrentUser={message.isCurrentUser}
                  text={message.text}
                  timeLabel={message.timeLabel}
                />
              ))}
            </View>
          ) : (
            <View style={styles.messageSection}>
              <ChatMessageBubble
                isCurrentUser={false}
                text={t('ride_support_chat_auto_message')}
                timeLabel={t('ride_chat_auto_time')}
              />
            </View>
          )}
        </ScrollView>

        {shouldShowQuickReplies ? (
          <View style={[styles.quickReplyRail, { borderTopColor: colors.border }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickReplyRow}
              keyboardShouldPersistTaps="handled"
            >
              {quickReplies.map((reply) => (
                <ChatQuickReplyChip
                  key={reply}
                  disabled={sendMessageMutation.isPending}
                  label={reply}
                  onPress={() => appendMessage(reply)}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <RideChatFooter
          attachmentAccessibilityLabel={t('ride_chat_add_attachment')}
          bottomInset={insets.bottom}
          isKeyboardVisible={isKeyboardVisible}
          isSending={sendMessageMutation.isPending}
          messageAccessibilityLabel={t('ride_chat_send_message')}
          onAttachmentPress={handleAttachmentPress}
          onChangeText={setDraftMessage}
          onSend={() => appendMessage(draftMessage)}
          placeholder={t('ride_support_chat_input_placeholder')}
          value={draftMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    paddingTop: 20,
  },
  chatLayout: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageSection: {
    gap: 12,
  },
  quickReplyRail: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 8,
    paddingTop: 8,
  },
  quickReplyRow: {
    gap: 8,
    paddingHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
});
