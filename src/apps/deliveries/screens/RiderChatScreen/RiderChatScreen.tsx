import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import type {
  DeliveryChatBoxRecord,
  DeliveryChatBoxesResponse,
  DeliveryChatMessageRecord,
  DeliveryChatMessagesResponse,
} from '../../api/chatServiceTypes';
import RiderChatComposer from '../../components/riderChat/RiderChatComposer';
import RiderChatHeader from '../../components/riderChat/RiderChatHeader';
import RiderChatMessageBubble from '../../components/riderChat/RiderChatMessageBubble';
import RiderQuickReplyChip from '../../components/riderChat/RiderQuickReplyChip';
import { useSendDeliveryChatMessage } from '../../hooks/useChatMutations';
import { useDeliveryChatBoxes, useDeliveryChatMessages } from '../../hooks/useChatQueries';

export type RiderChatScreenParams = {
  RiderChat: {
    estimatedMinutes: number;
    orderCode: string;
    receiverId: string;
    riderName: string;
  };
};

const BASE_MESSAGE_KEYS = [
  { id: 'rider-intro', sender: 'rider', textKey: 'rider_chat_message_rider_intro' },
  { id: 'user-reply', sender: 'user', textKey: 'rider_chat_message_user_reply' },
  { id: 'rider-eta', sender: 'rider', textKey: 'rider_chat_message_rider_eta' },
] as const;

type Sender = 'rider' | 'user';

type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  timeLabel?: string;
};

function getResponseItems<T>(
  response?: T[] | { data?: T[] | { items?: T[] } },
): T[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  const data = response.data;

  if (Array.isArray(data)) {
    return data;
  }

  return data?.items ?? [];
}

function resolveChatBoxId(chatBox: DeliveryChatBoxRecord): string | null {
  return chatBox.chatBoxId ?? chatBox.id ?? null;
}

function resolveParticipantId(participant?: { id?: string }, fallbackId?: string): string | null {
  return participant?.id ?? fallbackId ?? null;
}

function formatMessageTime(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  }).toLowerCase();
}

export default function RiderChatScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RiderChatScreenParams, 'RiderChat'>>();
  const { estimatedMinutes, receiverId, riderName } = route.params;
  const sessionQuery = useAuthSessionQuery();
  const senderId = sessionQuery.data?.user?.id;
  const [draftMessage, setDraftMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBoxesQuery = useDeliveryChatBoxes(senderId);
  const sendMessageMutation = useSendDeliveryChatMessage({
    onError: (error) => {
      showToast.error(t('rider_chat_send_error'), error.message);
    },
  });

  const initialMessages = useMemo(
    () =>
      BASE_MESSAGE_KEYS.map((message) => ({
        id: message.id,
        sender: message.sender,
        text: t(message.textKey, { minutes: estimatedMinutes }),
      })),
    [estimatedMinutes, t],
  );

  const chatBoxes = useMemo(
    () => getResponseItems<DeliveryChatBoxRecord>(chatBoxesQuery.data as DeliveryChatBoxesResponse | undefined),
    [chatBoxesQuery.data],
  );

  const activeChatBoxId = useMemo(() => {
    return (
      resolveChatBoxId(
        chatBoxes.find((chatBox) => {
          const chatSenderId = resolveParticipantId(chatBox.sender, chatBox.senderId);
          const chatReceiverId = resolveParticipantId(chatBox.receiver, chatBox.receiverId);

          return chatSenderId === receiverId || chatReceiverId === receiverId;
        }) ?? {},
      ) ??
      resolveChatBoxId(
        chatBoxes.find((chatBox) => {
          const chatSenderId = resolveParticipantId(chatBox.sender, chatBox.senderId);
          const chatReceiverId = resolveParticipantId(chatBox.receiver, chatBox.receiverId);

          return (
            (chatSenderId === senderId && chatReceiverId === receiverId) ||
            (chatSenderId === receiverId && chatReceiverId === senderId)
          );
        }) ?? {},
      ) ??
      null
    );
  }, [chatBoxes, receiverId, senderId]);

  const chatMessagesQuery = useDeliveryChatMessages(activeChatBoxId ?? undefined);

  useEffect(() => {
    const remoteMessages = getResponseItems<DeliveryChatMessageRecord>(
      chatMessagesQuery.data as DeliveryChatMessagesResponse | undefined,
    );

    if (remoteMessages.length === 0) {
      setMessages(initialMessages);
      return;
    }

    setMessages(
      remoteMessages.map((message, index) => {
        const messageSenderId = resolveParticipantId(message.sender, message.senderId);
        const sender: Sender = messageSenderId === senderId ? 'user' : 'rider';

        return {
          id: message.id ?? `${message.createdAt ?? 'message'}-${index}`,
          sender,
          text: message.text ?? '',
          timeLabel: index === 0 ? formatMessageTime(message.createdAt) : undefined,
        };
      }),
    );
  }, [chatMessagesQuery.data, initialMessages, senderId]);

  const submitMessage = (messageText: string, resetDraft = false) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const senderId = sessionQuery.data?.user?.id;

    if (!senderId) {
      showToast.error(t('rider_chat_send_error'), t('rider_chat_missing_session_error'));
      return;
    }

    if (!receiverId) {
      showToast.error(t('rider_chat_send_error'), t('rider_chat_missing_receiver_error'));
      return;
    }

    sendMessageMutation.mutate(
      {
        senderId,
        receiverId,
        text: trimmedMessage,
      },
      {
        onSuccess: () => {
          setMessages((current) => [
            ...current,
            {
              id: `${Date.now()}-${current.length}`,
              sender: 'user',
              text: trimmedMessage,
            },
          ]);

          if (activeChatBoxId) {
            void chatMessagesQuery.refetch();
          }

          if (resetDraft) {
            setDraftMessage('');
          }
        },
      },
    );
  };

  const handleQuickReply = (text: string) => {
    submitMessage(text);
  };

  const handleSend = () => {
    submitMessage(draftMessage, true);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <RiderChatHeader riderName={riderName} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 148 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.messageSection}>
          {messages.map((message, index) => (
            <RiderChatMessageBubble
              key={message.id}
              sender={message.sender}
              text={message.text}
              timeLabel={message.timeLabel ?? (index === 0 ? '8:29 pm' : undefined)}
            />
          ))}
        </View>

        <View style={styles.quickReplyRow}>
          <RiderQuickReplyChip
            disabled={sendMessageMutation.isPending}
            label={t('rider_chat_quick_reply_here')}
            onPress={() => handleQuickReply(t('rider_chat_quick_reply_here'))}
          />
          <RiderQuickReplyChip
            disabled={sendMessageMutation.isPending}
            label={t('rider_chat_quick_reply_hello')}
            onPress={() => handleQuickReply(t('rider_chat_quick_reply_hello'))}
          />
          <RiderQuickReplyChip
            disabled={sendMessageMutation.isPending}
            label={t('rider_chat_quick_reply_call_arrive')}
            onPress={() => handleQuickReply(t('rider_chat_quick_reply_call_arrive'))}
          />
          <RiderQuickReplyChip
            disabled={sendMessageMutation.isPending}
            label={t('rider_chat_quick_reply_where')}
            onPress={() => handleQuickReply(t('rider_chat_quick_reply_where'))}
          />
          <RiderQuickReplyChip
            disabled={sendMessageMutation.isPending}
            label={t('rider_chat_quick_reply_eta')}
            onPress={() => handleQuickReply(t('rider_chat_quick_reply_eta'))}
          />
        </View>
      </ScrollView>

      <View
        style={[
          styles.composer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <RiderChatComposer
          isSending={sendMessageMutation.isPending}
          value={draftMessage}
          onChangeText={setDraftMessage}
          onSend={handleSend}
          placeholder={t('rider_chat_input_placeholder')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  content: {
    minHeight: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  messageSection: {
    marginTop: 320,
  },
  quickReplyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
