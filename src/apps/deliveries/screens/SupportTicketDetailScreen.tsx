import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../general/components/Text';
import { showToast } from '../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../general/theme/theme';
import ChatComposer from '../components/chat/ChatComposer';
import ChatMessageBubble from '../components/chat/ChatMessageBubble';
import ChatQuickReplyChip from '../components/chat/ChatQuickReplyChip';
import SupportHeader from '../components/support/SupportHeader';
import { useSendSupportChatMessage } from '../hooks/useSupportChatMutations';
import { useSupportChatBox } from '../hooks/useSupportChatQueries';
import type { SupportNavigationParamList } from '../navigation/supportNavigationTypes';
import {
  formatSupportChatTimeLabel,
  getSupportChatBox,
  getSupportChatMessages,
  getSupportChatMessageId,
  getSupportChatOtherParticipant,
  getSupportChatParticipantId,
} from '../utils/supportChatMappers';

type SupportTicketDetailRouteProp = RouteProp<SupportNavigationParamList, 'SupportTicketDetail'>;

type TicketChatMessage = {
  id: string;
  isCurrentUser: boolean;
  text: string;
  timeLabel: string;
};

export default function SupportTicketDetailScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const route = useRoute<SupportTicketDetailRouteProp>();
  const { ticket } = route.params;
  const sessionQuery = useAuthSessionQuery();
  const [chatBoxId, setChatBoxId] = useState(ticket.chatBoxId);
  const [draftMessage, setDraftMessage] = useState('');
  const [pendingMessages, setPendingMessages] = useState<TicketChatMessage[]>([]);
  const supportChatBoxQuery = useSupportChatBox(chatBoxId);
  const supportChatSendMutation = useSendSupportChatMessage({
    onError: (error) => {
      setPendingMessages((current) => current.slice(0, -1));
      showToast.error(
        t('support_chat_send_error_title'),
        error.message || t('support_chat_send_error_message'),
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
    },
  });

  useEffect(() => {
    if (!chatBoxId && ticket.chatBoxId) {
      setChatBoxId(ticket.chatBoxId);
    }
  }, [chatBoxId, ticket.chatBoxId]);

  useEffect(() => {
    console.log('SupportTicketDetailScreen route ticket', {
      ticketChatBoxId: ticket.chatBoxId,
      ticketId: ticket.id,
      ticketTitle: ticket.title,
    });
  }, [ticket.chatBoxId, ticket.id, ticket.title]);

  useEffect(() => {
    const serverMessages = getSupportChatMessages(supportChatBoxQuery.data);

    if (serverMessages.length > 0 && pendingMessages.length > 0) {
      setPendingMessages([]);
    }
  }, [pendingMessages.length, supportChatBoxQuery.data]);

  const activeChatBox = useMemo(
    () => getSupportChatBox(supportChatBoxQuery.data),
    [supportChatBoxQuery.data],
  );
  const receiverId = useMemo(
    () =>
      getSupportChatParticipantId(
        getSupportChatOtherParticipant(activeChatBox, sessionQuery.data?.user?.id),
      ),
    [activeChatBox, sessionQuery.data?.user?.id],
  );

  useEffect(() => {
    console.log('SupportTicketDetailScreen chat setup', {
      activeChatBox,
      chatBoxId,
      receiverId,
      supportChatBoxData: supportChatBoxQuery.data,
      ticketChatBoxId: ticket.chatBoxId,
      userId: sessionQuery.data?.user?.id,
    });
  }, [
    activeChatBox,
    chatBoxId,
    receiverId,
    sessionQuery.data?.user?.id,
    supportChatBoxQuery.data,
    ticket.chatBoxId,
  ]);

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

    if (!mappedServerMessages.length && !pendingMessages.length) {
      return [
        {
          id: 'support-auto-message',
          isCurrentUser: false,
          text: t('support_chat_auto_message'),
          timeLabel: t('support_chat_auto_time'),
        },
      ];
    }

    return [...mappedServerMessages, ...pendingMessages];
  }, [pendingMessages, sessionQuery.data?.user?.id, supportChatBoxQuery.data, t]);

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

  const handleAppendMessage = (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    const senderId = sessionQuery.data?.user?.id;

    if (!senderId) {
      showToast.error(t('support_chat_send_error_title'), t('support_chat_missing_session_error'));
      return;
    }

    if (!receiverId) {
      console.log('SupportTicketDetailScreen missing receiver', {
        activeChatBox,
        chatBoxId,
        supportChatBoxData: supportChatBoxQuery.data,
        ticketChatBoxId: ticket.chatBoxId,
        userId: sessionQuery.data?.user?.id,
      });
      showToast.error(t('support_chat_send_error_title'), t('support_chat_missing_receiver_error'));
      return;
    }

    setPendingMessages((current) => [
      ...current,
      {
        id: `pending-${Date.now()}`,
        isCurrentUser: true,
        text: trimmedValue,
        timeLabel: formatSupportChatTimeLabel(new Date().toISOString()),
      },
    ]);

    supportChatSendMutation.mutate({
      senderId,
      receiverId,
      text: trimmedValue,
      chatBoxId,
    });

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        title={t('support_tickets_title')}
        rightAccessibilityLabel={t('support_tickets_search_action')}
        rightIconName="search-outline"
      />

      <KeyboardAvoidingView
        style={styles.chatLayout}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 20 : 0}
      >
        <View style={[styles.ticketHero, { backgroundColor: colors.supportTicketHeaderBackground }]}>
          <Text
            color={colors.white}
            weight="semiBold"
            style={[styles.ticketTitle, { fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }]}
            numberOfLines={2}
          >
            {ticket.title}
          </Text>

          <View style={[styles.statusChip, { backgroundColor: colors.green100 }]}>
            <Text
              color={colors.success}
              weight="medium"
              style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            >
              {ticket.statusLabel}
            </Text>
          </View>
        </View>

        <View style={[styles.ticketMeta, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text
            color={colors.mutedText}
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
            numberOfLines={1}
          >
            {ticket.preview}
          </Text>
          {ticket.orderIdLabel ? (
            <Text
              color={colors.text}
              weight="semiBold"
              style={{ fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }}
            >
              {ticket.orderIdLabel}
            </Text>
          ) : null}
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {chatBoxId && supportChatBoxQuery.isPending ? (
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
                label={reply}
                onPress={() => handleAppendMessage(reply)}
              />
            ))}
          </ScrollView>
        </View>

        <View
          style={[
            styles.composer,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <ChatComposer
            attachmentAccessibilityLabel={t('support_chat_add_attachment')}
            isSending={supportChatSendMutation.isPending}
            messageAccessibilityLabel={t('support_chat_send_message')}
            onAttachmentPress={() => undefined}
            onChangeText={setDraftMessage}
            onSend={() => handleAppendMessage(draftMessage)}
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
    paddingTop: 18,
    paddingBottom: 24,
  },
  messageSection: {
    gap: 20,
    paddingBottom: 18,
  },
  quickReplyRail: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  quickReplyRow: {
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  statusChip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ticketHero: {
    gap: 10,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
  },
  ticketMeta: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 4,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
  },
  ticketTitle: {
    maxWidth: '100%',
  },
});
