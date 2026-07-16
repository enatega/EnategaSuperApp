import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import ChatComposer from '../../../../general/components/chat/ChatComposer';
import ChatMessageBubble from '../../../../general/components/chat/ChatMessageBubble';
import ChatQuickReplyChip from '../../../../general/components/chat/ChatQuickReplyChip';
import { showToast } from '../../../../general/components/AppToast';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import { HOME_VISITS_SUPPORT_PHONE_NUMBER } from '../../constants/support';
import { useSupportChatBox, useSupportConversations, useSupportMyActiveMessages } from '../../hooks/useSupportAdmins';
import { useSendSupportChatMessageToAdmin } from '../../hooks/useSupportChatMutations';
import type { HomeVisitsStackParamList } from '../../navigation/types';
import {
  formatSupportChatTimeLabel,
  getFirstSupportChatBox,
  getSupportChatBox,
  getSupportChatBoxId,
  getSupportChatMessageId,
  getSupportChatMessages,
} from '../../utils/supportChatMappers';

type HomeVisitsSupportChatRouteProp = RouteProp<HomeVisitsStackParamList, 'SupportChat'>;

type SupportMessageItem = {
  id: string;
  isCurrentUser: boolean;
  text: string;
  timeLabel?: string;
};

export default function HomeVisitsSupportChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const route = useRoute<HomeVisitsSupportChatRouteProp>();
  const sessionQuery = useAuthSessionQuery();
  const currentUserId = sessionQuery.data?.user?.id;
  const [draftMessage, setDraftMessage] = useState('');
  const supportActiveMessagesQuery = useSupportMyActiveMessages();
  const supportConversationsQuery = useSupportConversations();
  const fallbackChatBox = useMemo(
    () => getFirstSupportChatBox(supportConversationsQuery.data),
    [supportConversationsQuery.data],
  );
  const activeChatBoxId =
    supportActiveMessagesQuery.data?.chatBoxId ??
    supportActiveMessagesQuery.data?.chat_box_id;
  const initialChatBoxId =
    route.params?.chatBoxId ??
    activeChatBoxId ??
    (getSupportChatBoxId(fallbackChatBox) || undefined);
  const [chatBoxId, setChatBoxId] = useState(initialChatBoxId);
  const [pendingMessages, setPendingMessages] = useState<SupportMessageItem[]>([]);
  const supportChatBoxQuery = useSupportChatBox(chatBoxId);
  const sendSupportMessageMutation = useSendSupportChatMessageToAdmin({
    onError: (error) => {
      setPendingMessages((current) => current.slice(0, -1));
      showToast.error(
        t('home_visits_support_chat_send_error_title'),
        error.message || t('home_visits_support_chat_send_error_message'),
      );
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
      void supportActiveMessagesQuery.refetch();
      void supportConversationsQuery.refetch();
      void supportChatBoxQuery.refetch();
    },
  });

  useEffect(() => {
    if (!chatBoxId && initialChatBoxId) {
      setChatBoxId(initialChatBoxId);
    }
  }, [chatBoxId, initialChatBoxId]);

  const activeChatBox = useMemo(
    () => getSupportChatBox(supportChatBoxQuery.data) ?? fallbackChatBox,
    [fallbackChatBox, supportChatBoxQuery.data],
  );

  const baseServerMessages = useMemo(() => {
    const chatBoxMessages = getSupportChatMessages(supportChatBoxQuery.data);

    if (chatBoxMessages.length > 0) {
      return chatBoxMessages;
    }

    return getSupportChatMessages(supportActiveMessagesQuery.data);
  }, [supportActiveMessagesQuery.data, supportChatBoxQuery.data]);

  const conversationMessages = useMemo<SupportMessageItem[]>(
    () =>
      baseServerMessages.map((message) => ({
        id: getSupportChatMessageId(message),
        isCurrentUser:
          (message.senderId ?? message.sender_id ?? message.sender?.id ?? message.sender?.userId) ===
          currentUserId,
        text: message.text ?? message.message ?? '',
        timeLabel: formatSupportChatTimeLabel(message.createdAt ?? message.created_at),
      })),
    [baseServerMessages, currentUserId],
  );

  const messages = useMemo(
    () => [...conversationMessages, ...pendingMessages],
    [conversationMessages, pendingMessages],
  );

  useEffect(() => {
    if (baseServerMessages.length > 0 && pendingMessages.length > 0) {
      setPendingMessages([]);
    }
  }, [baseServerMessages, pendingMessages.length]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: messages.length > 0 });
    });
  }, [messages]);

  const quickReplies = useMemo(
    () => [
      t('home_visits_support_chat_quick_reply_help'),
      t('home_visits_support_chat_quick_reply_booking'),
      t('home_visits_support_chat_quick_reply_payment'),
      t('home_visits_support_chat_quick_reply_provider'),
    ],
    [t],
  );

  const handleSend = useCallback((text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    if (!currentUserId) {
      showToast.error(
        t('home_visits_support_chat_send_error_title'),
        t('home_visits_support_chat_missing_session_error'),
      );
      return;
    }

    setPendingMessages((current) => [
      ...current,
      {
        id: `pending-${Date.now()}`,
        isCurrentUser: true,
        text: trimmed,
        timeLabel: formatSupportChatTimeLabel(new Date().toISOString()),
      },
    ]);

    const resolvedChatBoxId = chatBoxId ?? getSupportChatBoxId(activeChatBox) ?? undefined;

    sendSupportMessageMutation.mutate({
      senderId: currentUserId,
      chatBoxId: resolvedChatBoxId,
      text: trimmed,
    });
  }, [activeChatBox, chatBoxId, currentUserId, sendSupportMessageMutation, t]);

  const handleAttachmentPress = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showToast.error(
        t('home_visits_support_chat_attachment_permission_title'),
        t('home_visits_support_chat_attachment_permission_message'),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const asset = result.assets[0];

    showToast.success(
      t('home_visits_support_chat_attachment_selected_title'),
      t('home_visits_support_chat_attachment_selected_message', {
        fileName: asset.fileName ?? asset.uri.split('/').pop() ?? 'image',
      }),
    );
  }, [t]);

  const handleCallSupport = useCallback(async () => {
    try {
      await Linking.openURL(`tel:${HOME_VISITS_SUPPORT_PHONE_NUMBER}`);
    } catch {
      showToast.error(t('home_visits_support_call_unavailable'));
    }
  }, [t]);

  const title = route.params?.agentName ?? t('home_visits_support_chat_title');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('home_visits_support_back_action')}
        onRightPress={() => {
          void handleCallSupport();
        }}
        rightAccessibilityLabel={t('support_call_action')}
        title={title}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        style={styles.chatLayout}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.length ? (
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
                text={t('home_visits_support_chat_auto_message')}
                timeLabel={t('home_visits_support_chat_auto_time')}
              />
            </View>
          )}

          {!messages.length ? (
            <View style={styles.quickReplies}>
              {quickReplies.map((reply) => (
                <ChatQuickReplyChip
                  key={reply}
                  label={reply}
                  onPress={() => setDraftMessage(reply)}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <ChatComposer
            attachmentAccessibilityLabel={t('home_visits_support_chat_attachment_action')}
            isSending={sendSupportMessageMutation.isPending}
            messageAccessibilityLabel={t('home_visits_support_chat_send_action')}
            onAttachmentPress={() => {
              void handleAttachmentPress();
            }}
            onChangeText={setDraftMessage}
            onSend={() => handleSend(draftMessage)}
            placeholder={t('home_visits_support_chat_input_placeholder')}
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
  content: {
    flexGrow: 1,
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footer: {
    paddingTop: 8,
  },
  messageSection: {
    gap: 12,
  },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  screen: {
    flex: 1,
  },
});
