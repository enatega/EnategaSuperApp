import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useQueryClient } from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import type { SocketReceivedMessage } from '../../../../general/services/socket';
import { useTheme } from '../../../../general/theme/theme';
import ChatComposer from '../../components/chat/ChatComposer';
import ChatMessageBubble from '../../components/chat/ChatMessageBubble';
import ChatQuickReplyChip from '../../components/chat/ChatQuickReplyChip';
import { useDeliveriesSocketSession } from '../../hooks';
import { useSendSupportChatMessageToAdmin } from '../../hooks/useSupportChatMutations';
import { deliveryKeys } from '../../api/queryKeys';
import {
  useSupportChatBox,
  useSupportGroupedChatBoxes,
  useSupportMyActiveMessages,
} from '../../hooks/useSupportChatQueries';
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
} from '../../utils/supportChatMappers';
import { DELIVERIES_SUPPORT_PHONE_NUMBER } from '../../constants/support';
import type {
  SupportChatBoxDetailResponse,
  SupportChatMessageRecord,
  SupportMyActiveMessagesResponse,
} from '../../api/supportChatTypes';

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
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const route = useRoute<SupportChatRouteProp>();
  const sessionQuery = useAuthSessionQuery();
  useDeliveriesSocketSession();
  const supportActiveMessagesQuery = useSupportMyActiveMessages();
  const supportChatBoxesQuery = useSupportGroupedChatBoxes();
  const fallbackChatBox = useMemo(
    () => getFirstSupportChatBox(supportChatBoxesQuery.data),
    [supportChatBoxesQuery.data],
  );
  const fallbackParticipant = useMemo(
    () => getSupportChatOtherParticipant(fallbackChatBox, sessionQuery.data?.user?.id),
    [fallbackChatBox, sessionQuery.data?.user?.id],
  );
  const activeChatBoxId =
    supportActiveMessagesQuery.data?.chatBoxId ??
    supportActiveMessagesQuery.data?.chat_box_id;
  const initialChatBoxId =
    route.params?.chatBoxId
    ?? activeChatBoxId
    ?? (getSupportChatBoxId(fallbackChatBox) || undefined);
  const [chatBoxId, setChatBoxId] = useState(initialChatBoxId);
  const [pendingMessages, setPendingMessages] = useState<PendingSupportMessage[]>([]);
  const [realtimeMessages, setRealtimeMessages] = useState<PendingSupportMessage[]>([]);
  const supportChatBoxQuery = useSupportChatBox(chatBoxId);
  const refetchSupportChatBox = supportChatBoxQuery.refetch;
  const refetchSupportChatBoxes = supportChatBoxesQuery.refetch;
  const supportChatSendMutation = useSendSupportChatMessageToAdmin({
    onError: (error) => {
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

      void refetchSupportChatBoxes();
    },
  });
  const [draftMessage, setDraftMessage] = useState('');

  const appendMessageToChatBoxCache = (
    nextChatBoxId: string,
    nextMessage: SupportChatMessageRecord,
  ) => {
    queryClient.setQueryData<SupportChatBoxDetailResponse | undefined>(
      deliveryKeys.supportChatBox(nextChatBoxId),
      (current) => {
        if (!current) {
          return {
            chatBox: {
              chatBoxId: nextChatBoxId,
              messages: [nextMessage],
            },
          };
        }

        const currentMessages = getSupportChatMessages(current);
        const alreadyExists = currentMessages.some(
          (message) =>
            getSupportChatMessageId(message) === getSupportChatMessageId(nextMessage)
            || (
              (message.text ?? message.message ?? '').trim() ===
                (nextMessage.text ?? nextMessage.message ?? '').trim()
              && (message.senderId ?? message.sender_id) ===
                (nextMessage.senderId ?? nextMessage.sender_id)
            ),
        );

        if (alreadyExists) {
          return current;
        }

        const nextMessages = [...currentMessages, nextMessage];

        if (Array.isArray(current)) {
          return current;
        }

        if ('chatBox' in current && current.chatBox) {
          return {
            ...current,
            chatBox: {
              ...current.chatBox,
              chatBoxId: getSupportChatBoxId(current.chatBox) || nextChatBoxId,
              messages: nextMessages,
            },
          };
        }

        if ('chat_box' in current && current.chat_box) {
          return {
            ...current,
            chat_box: {
              ...current.chat_box,
              chatBoxId: getSupportChatBoxId(current.chat_box) || nextChatBoxId,
              messages: nextMessages,
            },
          };
        }

        if ('data' in current && current.data && !Array.isArray(current.data)) {
          return {
            ...current,
            data: {
              ...current.data,
              chatBoxId: getSupportChatBoxId(current.data) || nextChatBoxId,
              messages: nextMessages,
            },
          };
        }

        return current;
      },
    );

    queryClient.setQueryData<SupportMyActiveMessagesResponse | undefined>(
      deliveryKeys.supportChatMyActiveMessages(),
      (current) => {
        if (!current) {
          return {
            chatBoxId: nextChatBoxId,
            hasActiveChat: true,
            messages: [nextMessage],
            totalMessages: 1,
          };
        }

        const currentMessages = getSupportChatMessages(current);
        const alreadyExists = currentMessages.some(
          (message) =>
            getSupportChatMessageId(message) === getSupportChatMessageId(nextMessage)
            || (
              (message.text ?? message.message ?? '').trim() ===
                (nextMessage.text ?? nextMessage.message ?? '').trim()
              && (message.senderId ?? message.sender_id) ===
                (nextMessage.senderId ?? nextMessage.sender_id)
            ),
        );

        if (alreadyExists) {
          return current;
        }

        const nextMessages = [...currentMessages, nextMessage];

        return {
          ...current,
          chatBoxId: current.chatBoxId ?? nextChatBoxId,
          chat_box_id: current.chat_box_id ?? nextChatBoxId,
          hasActiveChat: true,
          messages: nextMessages,
          totalMessages: nextMessages.length,
        };
      },
    );
  };

  useEffect(() => {
    if (!chatBoxId && initialChatBoxId) {
      setChatBoxId(initialChatBoxId);
    }
  }, [chatBoxId, initialChatBoxId]);

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
  const messages = useMemo(() => {
    const currentUserId = sessionQuery.data?.user?.id;
    const activeMessages = getSupportChatMessages(supportActiveMessagesQuery.data);
    const serverMessages = getSupportChatMessages(supportChatBoxQuery.data);
    const sourceMessages = serverMessages.length > 0 ? serverMessages : activeMessages;
    const mappedServerMessages = sourceMessages.map((message) => ({
      id: getSupportChatMessageId(message),
      isCurrentUser:
        (message.senderId ?? message.sender_id ?? getSupportChatParticipantId(message.sender)) ===
        currentUserId,
      text: message.text ?? message.message ?? '',
      timeLabel: formatSupportChatTimeLabel(message.createdAt ?? message.created_at),
    }));
    const acknowledgedCurrentUserMessages = new Set(
      mappedServerMessages
        .filter((message) => message.isCurrentUser)
        .map((message) => message.text.trim()),
    );
    const unresolvedPendingMessages = pendingMessages.filter(
      (message) => !acknowledgedCurrentUserMessages.has(message.text.trim()),
    );

    if (
      !mappedServerMessages.length
      && !realtimeMessages.length
      && !unresolvedPendingMessages.length
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

    return [...mappedServerMessages, ...realtimeMessages, ...unresolvedPendingMessages];
  }, [
    pendingMessages,
    realtimeMessages,
    sessionQuery.data?.user?.id,
    supportActiveMessagesQuery.data,
    supportChatBoxQuery.data,
    t,
  ]);
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

    if (
      supportChatSendMutation.isPending
      && pendingMessages.some((message) => message.text.trim() === trimmed)
    ) {
      return;
    }

    const pendingMessageId = `pending-${Date.now()}`;
    const pendingTimeLabel = formatSupportChatTimeLabel(new Date().toISOString());

    setPendingMessages((current) => [
      ...current,
      {
        id: pendingMessageId,
        isCurrentUser: true,
        text: trimmed,
        timeLabel: pendingTimeLabel,
      },
    ]);
    setDraftMessage('');

    supportChatSendMutation.mutate(
      {
        senderId,
        text: trimmed,
        chatBoxId: chatBoxId ?? undefined,
      },
      {
        onError: () => {
          setPendingMessages((current) =>
            current.filter((message) => message.id !== pendingMessageId),
          );
        },
        onSuccess: (response) => {
          setPendingMessages((current) =>
            current.filter((message) => message.id !== pendingMessageId),
          );

          const nextChatBoxId =
            response.chatBoxId ??
            response.data?.chatBoxId ??
            response.detail?.chatBoxId ??
            response.detail?.chat_box_id ??
            chatBoxId;

          if (!nextChatBoxId) {
            return;
          }

          appendMessageToChatBoxCache(nextChatBoxId, {
            id: response.data?.id ?? response.detail?.id ?? pendingMessageId,
            senderId,
            text: response.detail?.text ?? trimmed,
            createdAt: response.detail?.createdAt ?? new Date().toISOString(),
            chatBoxId: nextChatBoxId,
          });
        },
      },
    );
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

  const handleCallSupport = async () => {
    try {
      await Linking.openURL(`tel:${DELIVERIES_SUPPORT_PHONE_NUMBER}`);
    } catch {
      showToast.error(t('support_call_action'));
    }
  };
  const showInitialLoadingState =
    (supportActiveMessagesQuery.isPending
      || supportChatBoxesQuery.isPending
      || Boolean(chatBoxId && supportChatBoxQuery.isPending))
    && messages.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel={t('support_back_action')}
        onRightPress={() => {
          void handleCallSupport();
        }}
        rightAccessibilityLabel={t('support_call_action')}
        title={t('support_title')}
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
          {showInitialLoadingState ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text color={colors.mutedText}>{t('support_chat_loading')}</Text>
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
                disabled={supportChatSendMutation.isPending}
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
