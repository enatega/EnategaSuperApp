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
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useSocketSession } from '../../../../general/hooks/useSocketSession';
import { socketClient } from '../../../../general/services/socket';
import type { SocketReceivedMessage } from '../../../../general/services/socket';
import { useTheme } from '../../../../general/theme/theme';
import type {
  DeliveryChatBoxRecord,
  DeliveryChatBoxesResponse,
  DeliveryChatMessageRecord,
  DeliveryChatMessagesResponse,
} from '../../api/chatServiceTypes';
import RiderChatFooter from '../../components/riderChat/RiderChatFooter';
import RiderChatHeader from '../../components/riderChat/RiderChatHeader';
import RiderChatMessageList from '../../components/riderChat/RiderChatMessageList';
import RiderChatQuickReplies from '../../components/riderChat/RiderChatQuickReplies';
import type { RiderChatMessage } from '../../components/riderChat/types';
import { useSendDeliveryChatMessage } from '../../hooks/useChatMutations';
import { useDeliveryChatBoxes, useDeliveryChatMessages } from '../../hooks/useChatQueries';

export type RiderChatScreenParams = {
  RiderChat: {
    chatBoxId?: string;
    estimatedMinutes: number;
    orderCode: string;
    receiverId: string;
    riderAvatarUri?: string;
    riderName: string;
  };
};

function getResponseItems<T>(
  response?: T[] | { messages?: T[]; data?: T[] | { items?: T[] } },
): T[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.messages)) {
    return response.messages;
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
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const sessionQuery = useAuthSessionQuery();
  useSocketSession();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RiderChatScreenParams, 'RiderChat'>>();
  const initialChatBoxId = route.params.chatBoxId;
  const riderName = route.params.riderName;
  const riderAvatarUri = route.params.riderAvatarUri;
  const senderId = sessionQuery.data?.user?.id;
  const receiverId = route.params.receiverId;

  const [draftMessage, setDraftMessage] = useState('');
  const [messages, setMessages] = useState<RiderChatMessage[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

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
    if (initialChatBoxId) {
      return initialChatBoxId;
    }

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
            (chatSenderId === senderId && chatReceiverId === receiverId)
            || (chatSenderId === receiverId && chatReceiverId === senderId)
          );
        }) ?? {},
      ) ??
      null
    );
  }, [chatBoxes, initialChatBoxId, receiverId, senderId]);

  const chatMessagesQuery = useDeliveryChatMessages(resolvedChatBoxId ?? undefined);

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

        return {
          id: message.id ?? `${message.createdAt ?? 'message'}-${index}`,
          sender: messageSenderId === senderId ? 'user' : 'rider',
          text: message.text ?? '',
          timeLabel: formatMessageTime(message.createdAt),
        };
      }),
    );
  }, [chatMessagesQuery.data, senderId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: messages.length > 0 });
    });
  }, [messages]);

  useEffect(() => {
    if (!senderId || !receiverId) {
      return undefined;
    }

    return socketClient.onReceiveMessage((message: SocketReceivedMessage) => {
      const isConversationMessage =
        message.receiver === senderId && message.sender === receiverId;

      if (!isConversationMessage) {
        return;
      }

      setMessages((current) => {
        const alreadyExists = current.some(
          (item) => item.sender === 'rider' && item.text === message.text,
        );

        if (alreadyExists) {
          return current;
        }

        return [
          ...current,
          {
            id: `realtime-${Date.now()}`,
            sender: 'rider',
            text: message.text,
            timeLabel: formatMessageTime(new Date().toISOString()),
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
    receiverId,
    resolvedChatBoxId,
    senderId,
  ]);

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

  const submitMessage = (messageText: string, resetDraft = false) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

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
        chatBoxId: resolvedChatBoxId ?? initialChatBoxId,
        senderId,
        receiverId,
        text: trimmedMessage,
      },
      {
        onSuccess: (response) => {
          setMessages((current) => [
            ...current,
            {
              id: `${Date.now()}-${current.length}`,
              sender: 'user',
              text: trimmedMessage,
              timeLabel: formatMessageTime(new Date().toISOString()),
            },
          ]);

          if (response.chatBoxId || resolvedChatBoxId) {
            void chatBoxesQuery.refetch();
            void chatMessagesQuery.refetch();
          }

          if (resetDraft) {
            setDraftMessage('');
          }
        },
      },
    );
  };

  const handleQuickReply = useCallback((text: string) => {
    submitMessage(text);
  }, []);

  const handleSend = useCallback(() => {
    submitMessage(draftMessage, true);
  }, [draftMessage]);

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

    if (resolvedChatBoxId) {
      await chatMessagesQuery.refetch();
    }
  }, [chatBoxesQuery, chatMessagesQuery, resolvedChatBoxId]);

  const quickReplies = useMemo(
    () => [
      t('rider_chat_quick_reply_here'),
      t('rider_chat_quick_reply_hello'),
      t('rider_chat_quick_reply_call_arrive'),
      t('rider_chat_quick_reply_where'),
      t('rider_chat_quick_reply_eta'),
    ],
    [t],
  );

  const isRefreshing = chatBoxesQuery.isRefetching || chatMessagesQuery.isRefetching;
  const hasRealMessages = useMemo(
    () => messages.some((message) => message.text.trim().length > 0),
    [messages],
  );

  const displayMessages = useMemo<RiderChatMessage[]>(() => {
    if (hasRealMessages) {
      return messages;
    }

    return [
      {
        id: 'rider-chat-empty-state',
        sender: 'rider',
        text: t('rider_chat_auto_message'),
        timeLabel: t('rider_chat_auto_time'),
      },
    ];
  }, [hasRealMessages, messages, t]);

  const shouldShowQuickReplies = !hasRealMessages && !isKeyboardVisible;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <RiderChatHeader
        riderAvatarUri={riderAvatarUri}
        riderName={riderName}
        onCallPress={() => {}}
      />

      <View style={styles.chatLayout}>
        <RiderChatMessageList
          isRefreshing={isRefreshing}
          messages={displayMessages}
          onRefresh={handleRefresh}
          scrollViewRef={scrollViewRef}
        />

        {shouldShowQuickReplies ? (
          <RiderChatQuickReplies
            disabled={sendMessageMutation.isPending}
            onPressReply={handleQuickReply}
            replies={quickReplies}
          />
        ) : null}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
          keyboardVerticalOffset={0}
        >
          <RiderChatFooter
            bottomInset={insets.bottom}
            isKeyboardVisible={isKeyboardVisible}
            onAttachmentPress={handleAttachmentPress}
            isSending={sendMessageMutation.isPending}
            value={draftMessage}
            onChangeText={setDraftMessage}
            onSend={handleSend}
            placeholder={t('rider_chat_input_placeholder')}
          />
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatLayout: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});
