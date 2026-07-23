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
import {
  appointmentSupportService,
  type AppointmentSupportMessage,
} from '../../api/supportService';
import type { AppointmentsStackParamList } from '../../navigation/types';

const SUPPORT_PHONE_NUMBER = '+13077768999';

export default function AppointmentsSupportChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<AppointmentsStackParamList, 'SupportChat'>>();
  const session = useAuthSessionQuery();
  const [draftMessage, setDraftMessage] = useState('');
  const [chatBoxId, setChatBoxId] = useState(route.params?.chatBoxId);
  const [pendingMessages, setPendingMessages] = useState<AppointmentSupportMessage[]>([]);
  const agentsQuery = useQuery({
    queryKey: ['appointments', 'support', 'agents'],
    queryFn: appointmentSupportService.getAgents,
  });
  const messagesQuery = useQuery({
    queryKey: ['appointments', 'support', 'messages', chatBoxId],
    queryFn: () => appointmentSupportService.getMessages(chatBoxId!),
    enabled: Boolean(chatBoxId),
  });
  const selectedAgent = agentsQuery.data?.[0];
  const receiverId =
    route.params?.receiverId ?? selectedAgent?.userId ?? selectedAgent?.id;
  const serverMessages = messagesQuery.data?.messages ?? [];
  const messages = useMemo(() => {
    const combined = [...serverMessages, ...pendingMessages];
    if (combined.length) return combined;
    return [
      {
        id: 'support-auto-message',
        text: 'How can we help you?',
        createdAt: new Date().toISOString(),
      },
    ];
  }, [pendingMessages, serverMessages]);

  const sendMutation = useMutation({
    mutationFn: appointmentSupportService.sendMessage,
    onSuccess: (response) => {
      if (chatBoxId === response.chatBoxId) {
        void messagesQuery.refetch();
      }
      setChatBoxId(response.chatBoxId);
      setPendingMessages([]);
      setDraftMessage('');
    },
    onError: (error) => {
      setPendingMessages([]);
      showToast.error('Message not sent', error.message);
    },
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    });
  }, [messages.length]);

  const appendMessage = (value: string) => {
    const text = value.trim();
    const senderId = session.data?.user?.id;
    if (!text || sendMutation.isPending) return;
    if (!senderId) {
      showToast.error('Unable to send message', 'Please sign in again.');
      return;
    }
    if (!receiverId) {
      showToast.error('No support agent is available right now');
      return;
    }

    setPendingMessages([
      {
        id: `pending-${Date.now()}`,
        senderId,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraftMessage('');
    sendMutation.mutate({ senderId, receiverId, text });
  };

  const handleAttachmentPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      showToast.error('Photo access is required to attach an image.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length) {
      showToast.success('Attachment selected', 'Your image is ready to attach.');
    }
  };

  const showInitialLoadingState =
    (agentsQuery.isPending || Boolean(chatBoxId && messagesQuery.isPending)) &&
    serverMessages.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SupportHeader
        backAccessibilityLabel="Go back"
        onRightPress={() => void Linking.openURL(`tel:${SUPPORT_PHONE_NUMBER}`)}
        rightAccessibilityLabel="Call support"
        title="Support"
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
              <Text color={colors.mutedText}>Loading support chat…</Text>
            </View>
          ) : messagesQuery.isError ? (
            <View style={styles.centerState}>
              <Text color={colors.danger}>{messagesQuery.error.message}</Text>
            </View>
          ) : (
            <View style={styles.messageSection}>
              {messages.map((message, index) => {
                const senderId = message.senderId ?? message.sender_id;
                const nextMessage = messages[index + 1];
                const nextSenderId = nextMessage?.senderId ?? nextMessage?.sender_id;
                const showTime = !nextMessage || senderId !== nextSenderId;
                return (
                <ChatMessageBubble
                  key={message.id}
                  bubbleMinWidth={72}
                  isCurrentUser={
                    (message.senderId ?? message.sender_id) ===
                    session.data?.user?.id
                  }
                  text={message.text}
                  timeLabel={showTime ? (
                    message.id === 'support-auto-message'
                      ? 'Now'
                      : message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : undefined
                  ) : undefined}
                />
                );
              })}
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.composer,
            {
              backgroundColor: colors.background,
              paddingBottom:
                Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : 12,
            },
          ]}
        >
          <ChatComposer
            attachmentAccessibilityLabel="Add attachment"
            isSending={sendMutation.isPending}
            messageAccessibilityLabel="Send message"
            onAttachmentPress={() => void handleAttachmentPress()}
            onChangeText={setDraftMessage}
            onSend={() => appendMessage(draftMessage)}
            placeholder="Enter your concern..."
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
  chatLayout: { flex: 1 },
  composer: {},
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageSection: { gap: 10, paddingBottom: 8 },
  screen: { flex: 1 },
  scrollView: { flex: 1 },
});
