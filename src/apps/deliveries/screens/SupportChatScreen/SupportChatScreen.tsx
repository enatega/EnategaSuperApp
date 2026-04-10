import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import type { SocketReceivedMessage } from '../../../../general/services/socket';
import { useTheme } from '../../../../general/theme/theme';
import ChatComposer from '../../components/chat/ChatComposer';
import ChatMessageBubble from '../../components/chat/ChatMessageBubble';
import ChatQuickReplyChip from '../../components/chat/ChatQuickReplyChip';
import SupportHeader from '../../components/support/SupportHeader';
import { useDeliveriesSocketSession } from '../../hooks';
import { useSendSupportChatMessage } from '../../hooks/useSupportChatMutations';
import { useSupportChatBox, useSupportGroupedChatBoxes } from '../../hooks/useSupportChatQueries';
import { SupportNavigationParamList } from '../../navigation/supportNavigationTypes';
import { subscribeDeliveriesEvent } from '../../socket/deliveriesSocket';
import {
  formatSupportChatTimeLabel,
  getFirstSupportChatBox,
  getSupportChatBox,
  getSupportChatBoxId,
  getSupportChatMessages,
  getSupportChatMessageId,
  getSupportChatOtherParticipant,
  getSupportChatParticipantId,
  getSupportChatParticipantName,
} from '../../utils/supportChatMappers';

type SupportChatRouteProp = RouteProp<SupportNavigationParamList, 'SupportChat'>;

const TEMP_SUPPORT_RECEIVER_ID = '79f6cbfa-2b05-49b8-9b31-01e84bc540d9';

type PendingSupportMessage = {
  id: string;
  isCurrentUser: boolean;
  text: string;
  timeLabel: string;
};

export default function SupportChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const route = useRoute<SupportChatRouteProp>();
  const sessionQuery = useAuthSessionQuery();
  useDeliveriesSocketSession();
  const supportChatBoxesQuery = useSupportGroupedChatBoxes();
  const fallbackChatBox = useMemo(
    () => getFirstSupportChatBox(supportChatBoxesQuery.data),
    [supportChatBoxesQuery.data],
  );
  const fallbackParticipant = useMemo(
    () => getSupportChatOtherParticipant(fallbackChatBox, sessionQuery.data?.user?.id),
    [fallbackChatBox, sessionQuery.data?.user?.id],
  );
  const initialChatBoxId =
    route.params?.chatBoxId ?? (getSupportChatBoxId(fallbackChatBox) || undefined);
  const [chatBoxId, setChatBoxId] = useState(initialChatBoxId);
  const [pendingMessages, setPendingMessages] = useState<PendingSupportMessage[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<PendingSupportMessage[]>([]);
  const supportChatBoxQuery = useSupportChatBox(chatBoxId);
  const refetchSupportChatBox = supportChatBoxQuery.refetch;
  const refetchSupportChatBoxes = supportChatBoxesQuery.refetch;
  const supportChatSendMutation = useSendSupportChatMessage({
    onError: (error) => {
      setPendingMessages((current) => current.slice(0, -1));
      showToast.error(t('support_chat_send_error_title'), error.message || t('support_chat_send_error_message'));
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
    },
  });
  const [draftMessage, setDraftMessage] = useState('');

  useEffect(() => {
    if (!chatBoxId && initialChatBoxId) {
      setChatBoxId(initialChatBoxId);
    }
  }, [chatBoxId, initialChatBoxId]);

  useEffect(() => {
    const serverMessages = getSupportChatMessages(supportChatBoxQuery.data);

    if (serverMessages.length > 0 && pendingMessages.length > 0) {
      setPendingMessages([]);
    }
  }, [pendingMessages.length, supportChatBoxQuery.data]);

  const activeChatBox = useMemo(
    () => getSupportChatBox(supportChatBoxQuery.data) ?? fallbackChatBox,
    [fallbackChatBox, supportChatBoxQuery.data],
  );
  const activeParticipant = useMemo(
    () =>
      getSupportChatOtherParticipant(activeChatBox, sessionQuery.data?.user?.id) ??
      fallbackParticipant,
    [activeChatBox, fallbackParticipant, sessionQuery.data?.user?.id],
  );
  const agentName =
    route.params?.agentName ||
    getSupportChatParticipantName(activeParticipant) ||
    t('support_chat_agent_name');
  const messages = useMemo(() => {
    const currentUserId = sessionQuery.data?.user?.id;
    const serverMessages = getSupportChatMessages(supportChatBoxQuery.data);
    const mappedServerMessages = serverMessages.map((message) => ({
      id: getSupportChatMessageId(message),
      isCurrentUser:
        (message.senderId ?? message.sender_id ?? getSupportChatParticipantId(message.sender)) ===
        currentUserId,
      text: message.text ?? message.message ?? '',
      timeLabel: formatSupportChatTimeLabel(message.createdAt ?? message.created_at),
    }));

    if (
      !mappedServerMessages.length
      && !realtimeMessages.length
      && !pendingMessages.length
    ) {
      return [
        {
          id: 'support-auto-message',
          isCurrentUser: false,
          text: t('support_chat_auto_message'),
          timeLabel: t('support_chat_auto_time'),
        },
      ];
    }

    return [...mappedServerMessages, ...realtimeMessages, ...pendingMessages];
  }, [pendingMessages, realtimeMessages, sessionQuery.data?.user?.id, supportChatBoxQuery.data, t]);
  const receiverId =
    route.params?.receiverId ||
    getSupportChatParticipantId(activeParticipant) ||
    TEMP_SUPPORT_RECEIVER_ID;

  const quickReplies = useMemo(
    () => [
      t('support_chat_quick_reply_here'),
      t('support_chat_quick_reply_hello'),
      t('support_chat_quick_reply_call_arrive'),
      t('support_chat_quick_reply_where'),
      t('support_chat_quick_reply_eta'),
    ],
    [t],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    });
  }, [messages.length]);

  useEffect(() => {
    setRealtimeMessages((current) => {
      const nextMessages = current.filter((item) => !messages.some(
        (serverMessage) =>
          serverMessage.id !== item.id
          && serverMessage.isCurrentUser === item.isCurrentUser
          && serverMessage.text === item.text,
      ));

      return nextMessages.length === current.length ? current : nextMessages;
    });
  }, [messages]);

  useEffect(() => {
    const currentUserId = sessionQuery.data?.user?.id;

    if (!currentUserId || !receiverId) {
      return undefined;
    }

    return subscribeDeliveriesEvent('receive-message', (message: SocketReceivedMessage) => {
      const isConversationMessage =
        message.receiver === currentUserId && message.sender === receiverId;

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
            timeLabel: formatSupportChatTimeLabel(new Date().toISOString()),
          },
        ];
      });

      void refetchSupportChatBoxes();
      if (chatBoxId) {
        void refetchSupportChatBox();
      }
    });
  }, [
    chatBoxId,
    refetchSupportChatBox,
    refetchSupportChatBoxes,
    receiverId,
    sessionQuery.data?.user?.id,
  ]);

  const appendMessage = (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    const senderId = sessionQuery.data?.user?.id;

    if (!senderId) {
      showToast.error(t('support_chat_send_error_title'), t('support_chat_missing_session_error'));
      return;
    }

    if (!receiverId) {
      showToast.error(t('support_chat_send_error_title'), t('support_chat_missing_receiver_error'));
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

    supportChatSendMutation.mutate({
      receiverId,
      senderId,
      text: trimmed,
    });
  };

  const handleAttachmentPress = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showToast.error(
        t('support_chat_attachment_permission_title'),
        t('support_chat_attachment_permission_message'),
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
      t('support_chat_attachment_selected_title'),
      t('support_chat_attachment_selected_message', {
        fileName: asset.fileName ?? asset.uri.split('/').pop() ?? 'image',
      }),
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        title={agentName}
        rightAccessibilityLabel={t('support_call_action')}
      />

      <KeyboardAvoidingView
        style={styles.chatLayout}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 20 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {supportChatBoxesQuery.isPending || (chatBoxId && supportChatBoxQuery.isPending) ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text color={colors.mutedText}>{t('support_chat_loading')}</Text>
            </View>
          ) : !chatBoxId && pendingMessages.length === 0 ? (
            <View style={styles.centerState}>
              <Text color={colors.mutedText}>{t('support_chat_empty')}</Text>
            </View>
          ) : supportChatBoxQuery.isError ? (
            <View style={styles.centerState}>
              <Text color={colors.danger}>{supportChatBoxQuery.error.message}</Text>
            </View>
          ) : (
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
          )}
        </ScrollView>

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
                label={reply}
                onPress={() => appendMessage(reply)}
              />
            ))}
          </ScrollView>
        </View>

        <View
          style={[
            styles.composer,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <ChatComposer
            attachmentAccessibilityLabel={t('support_chat_add_attachment')}
            isSending={supportChatSendMutation.isPending}
            messageAccessibilityLabel={t('support_chat_send_message')}
            onAttachmentPress={handleAttachmentPress}
            onChangeText={setDraftMessage}
            onSend={() => appendMessage(draftMessage)}
            placeholder={t('support_chat_input_placeholder')}
            value={draftMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
    minHeight: 240,
    paddingHorizontal: 24,
  },
  chatLayout: {
    flex: 1,
  },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  messageSection: {
    gap: 20,
    paddingBottom: 8,
  },
  quickReplyRail: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  quickReplyRow: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 12,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
