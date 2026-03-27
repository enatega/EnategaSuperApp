import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
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

type Sender = 'rider' | 'user';

type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  timeLabel?: string;
};

const HARDCODED_SENDER_ID = 'b0e84890-0d23-4aac-93d9-99b80620d84c';
const HARDCODED_RECEIVER_ID = '4825e24a-6100-4c00-9f45-d5b8bb31d7ac';
const TEMP_CHAT_BOX_ID = '6f423e32-59df-404a-809f-4208c73d960a';

function getResponseItems<T>(
  response?: T[] | { messages?: T[]; data?: T[] | { items?: T[] } },
): T[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  const data = response.data;

  if (Array.isArray(response.messages)) {
    return response.messages;
  }

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
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RiderChatScreenParams, 'RiderChat'>>();
  const { estimatedMinutes, riderName } = route.params;
  const senderId = HARDCODED_SENDER_ID;
  const receiverId = HARDCODED_RECEIVER_ID;
  const [draftMessage, setDraftMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBoxesQuery = useDeliveryChatBoxes(senderId);
  const sendMessageMutation = useSendDeliveryChatMessage({
    onError: (error) => {
      showToast.error(t('rider_chat_send_error'), error.message);
    },
  });

  const chatBoxes = useMemo(
    () => getResponseItems<DeliveryChatBoxRecord>(chatBoxesQuery.data as DeliveryChatBoxesResponse | undefined),
    [chatBoxesQuery.data],
  );

  const resolvedChatBoxId = useMemo(() => {
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

  const activeChatBoxId = resolvedChatBoxId ?? TEMP_CHAT_BOX_ID;
  const chatMessagesQuery = useDeliveryChatMessages(activeChatBoxId ?? undefined);

  useEffect(() => {
    console.log('rider chat route config', {
      estimatedMinutes,
      receiverId,
      riderName,
      senderId,
      routeParams: route.params,
    });
  }, [estimatedMinutes, receiverId, riderName, route.params, senderId]);

  useEffect(() => {
    const remoteMessages = getResponseItems<DeliveryChatMessageRecord>(
      chatMessagesQuery.data as DeliveryChatMessagesResponse | undefined,
    );

    setMessages(
      remoteMessages.map((message, index) => {
        const messageSenderId = resolveParticipantId(
          message.sender,
          message.senderId ?? message.sender_id,
        );
        const sender: Sender = messageSenderId === senderId ? 'user' : 'rider';

        return {
          id: message.id ?? `${message.createdAt ?? 'message'}-${index}`,
          sender,
          text: message.text ?? '',
          timeLabel: formatMessageTime(message.createdAt),
        };
      }),
    );
  }, [chatMessagesQuery.data, senderId]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  const submitMessage = (messageText: string, resetDraft = false) => {
    const trimmedMessage = messageText.trim();

    console.log('rider chat submit start', {
      messageText,
      receiverId,
      resetDraft,
      trimmedMessage,
    });

    if (!trimmedMessage) {
      return;
    }

    console.log('rider chat ids', {
      senderId,
      receiverId,
    });

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
        onSuccess: (response) => {
          console.log('rider chat send success', {
            senderId,
            receiverId,
            text: trimmedMessage,
            activeChatBoxId,
            chatBoxId: response.chatBoxId,
          });

          setMessages((current) => [
            ...current,
            {
              id: `${Date.now()}-${current.length}`,
              sender: 'user',
              text: trimmedMessage,
              timeLabel: formatMessageTime(new Date().toISOString()),
            },
          ]);

          if (response.chatBoxId || activeChatBoxId) {
            void chatBoxesQuery.refetch();
            void chatMessagesQuery.refetch();
          }

          if (resetDraft) {
            setDraftMessage('');
          }
        },
        onError: (error) => {
          console.log('rider chat send error', {
            senderId,
            receiverId,
            text: trimmedMessage,
            error: error.message,
          });
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

  const handleAttachmentPress = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      showToast.error(
        t('rider_chat_attachment_permission_title'),
        t('rider_chat_attachment_permission_message'),
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
      t('rider_chat_attachment_selected_title'),
      t('rider_chat_attachment_selected_message', {
        fileName: asset.fileName ?? asset.uri.split('/').pop() ?? 'image',
      }),
    );
  }, [t]);

  const handleRefresh = useCallback(async () => {
    await chatBoxesQuery.refetch();

    if (activeChatBoxId) {
      await chatMessagesQuery.refetch();
    }
  }, [activeChatBoxId, chatBoxesQuery, chatMessagesQuery]);

  const isRefreshing = chatBoxesQuery.isRefetching || chatMessagesQuery.isRefetching;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <RiderChatHeader riderName={riderName} />

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
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.messageSection}>
            {messages.map((message) => (
              <RiderChatMessageBubble
                key={message.id}
                sender={message.sender}
                text={message.text}
                timeLabel={message.timeLabel}
              />
            ))}
          </View>
        </ScrollView>

        <View style={[styles.quickReplyRail, { borderTopColor: colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickReplyRow}
            keyboardShouldPersistTaps="handled"
          >
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
          <RiderChatComposer
            onAttachmentPress={handleAttachmentPress}
            isSending={sendMessageMutation.isPending}
            value={draftMessage}
            onChangeText={setDraftMessage}
            onSend={handleSend}
            placeholder={t('rider_chat_input_placeholder')}
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
