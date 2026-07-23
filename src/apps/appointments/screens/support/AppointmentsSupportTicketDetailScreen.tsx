import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatComposer from '../../../../general/components/chat/ChatComposer';
import ChatMessageBubble from '../../../../general/components/chat/ChatMessageBubble';
import SupportHeader from '../../../../general/components/support/SupportHeader';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';
import { useTheme } from '../../../../general/theme/theme';
import { appointmentSupportService, type AppointmentSupportMessage } from '../../api/supportService';
import type { AppointmentsStackParamList } from '../../navigation/types';

export default function AppointmentsSupportTicketDetailScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<AppointmentsStackParamList, 'SupportTicketDetail'>>();
  const { ticket } = route.params;
  const session = useAuthSessionQuery();
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<AppointmentSupportMessage[]>([]);
  const messagesQuery = useQuery({
    queryKey: ['appointments', 'support', 'ticket-messages', ticket.chatBoxId],
    queryFn: () => appointmentSupportService.getMessages(ticket.chatBoxId!),
    enabled: Boolean(ticket.chatBoxId),
  });
  const messages = useMemo(
    () => [...(messagesQuery.data?.messages ?? []), ...pending],
    [messagesQuery.data?.messages, pending],
  );
  const sendMutation = useMutation({
    mutationFn: (text: string) => appointmentSupportService.sendTicketMessage(ticket.chatBoxId!, text),
    onSuccess: async () => {
      setDraft('');
      setPending([]);
      await messagesQuery.refetch();
    },
    onError: (error) => {
      setPending([]);
      showToast.error('Reply not sent', error.message);
    },
  });

  useEffect(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: false }));
  }, [messages.length]);

  const submitReply = () => {
    const text = draft.trim();
    const senderId = session.data?.user?.id;
    if (!text || !senderId || !ticket.chatBoxId || sendMutation.isPending) return;
    setPending([{ id: `pending-${Date.now()}`, senderId, text, createdAt: new Date().toISOString() }]);
    setDraft('');
    sendMutation.mutate(text);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        title="My tickets"
        backAccessibilityLabel="Go back"
        rightAccessibilityLabel="Search tickets"
        rightIconName="search-outline"
      />
      <KeyboardAvoidingView style={styles.layout} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 20 : 0}>
        <View style={[styles.ticketHero, { backgroundColor: colors.supportTicketHeaderBackground }]}>
          <Text color={colors.white} weight="semiBold" style={[styles.ticketTitle, { fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }]} numberOfLines={2}>
            {ticket.title.replaceAll('_', ' ')}
          </Text>
          <View style={[styles.statusChip, { backgroundColor: colors.green100 }]}>
            <Text color={colors.success} weight="medium" style={{ fontSize: typography.size.xs2, lineHeight: 18 }}>
              {ticket.status.label}
            </Text>
          </View>
        </View>

        <View style={[styles.ticketMeta, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text color={colors.mutedText} style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }} numberOfLines={2}>
            {ticket.subtitle}
          </Text>
          <Text color={colors.text} weight="semiBold" style={{ fontSize: typography.size.xl2, lineHeight: typography.lineHeight.xl2 }}>
            Ticket #{ticket.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {messagesQuery.isPending && !messages.length ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text color={colors.mutedText}>Loading support chat…</Text>
            </View>
          ) : messagesQuery.isError ? (
            <View style={styles.centerState}><Text color={colors.danger}>{messagesQuery.error.message}</Text></View>
          ) : (
            <View style={styles.messages}>
              {messages.length ? messages.map((message) => (
                <ChatMessageBubble key={message.id} bubbleMinWidth={72} isCurrentUser={(message.senderId ?? message.sender_id) === session.data?.user?.id} text={message.text} timeLabel={message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined} />
              )) : (
                <ChatMessageBubble bubbleMinWidth={72} text="How can we help you?" timeLabel="Now" />
              )}
            </View>
          )}
        </ScrollView>
        <View style={[styles.composer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : 12 }]}><ChatComposer attachmentAccessibilityLabel="Add attachment" isSending={sendMutation.isPending} messageAccessibilityLabel="Send reply" onAttachmentPress={() => showToast.info('Attachments will be available soon')} onChangeText={setDraft} onSend={submitReply} placeholder="Enter your concern..." value={draft} /></View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: { alignItems: 'center', gap: 12, justifyContent: 'center', minHeight: 240, paddingHorizontal: 24 },
  screen: { flex: 1 }, layout: { flex: 1 }, scroll: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 24, paddingHorizontal: 16, paddingTop: 18 },
  messages: { gap: 10, paddingBottom: 18 }, composer: { borderTopWidth: StyleSheet.hairlineWidth },
  statusChip: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  ticketHero: { gap: 10, paddingBottom: 20, paddingHorizontal: 22, paddingTop: 22 },
  ticketMeta: { borderBottomWidth: StyleSheet.hairlineWidth, gap: 4, paddingBottom: 20, paddingHorizontal: 22, paddingTop: 18 },
  ticketTitle: { maxWidth: '100%', textTransform: 'capitalize' },
});
