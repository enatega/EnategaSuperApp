import React, { RefObject } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import ChatMessageBubble from '../../../../../general/components/chat/ChatMessageBubble';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { RideChatMessageItem } from '../types';

type Props = {
  errorMessage?: string;
  isLoading: boolean;
  messages: RideChatMessageItem[];
  scrollViewRef: RefObject<ScrollView | null>;
};

export default function RideChatMessageList({
  errorMessage,
  isLoading,
  messages,
  scrollViewRef,
}: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }}
    >
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : errorMessage ? (
        <View style={styles.centerState}>
          <Text color={colors.danger}>{errorMessage}</Text>
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
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageSection: {
    gap: 20,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
});
