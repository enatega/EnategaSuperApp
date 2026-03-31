import React, { RefObject } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import RiderChatMessageBubble from './RiderChatMessageBubble';
import type { RiderChatMessage } from './types';

type Props = {
  isRefreshing: boolean;
  messages: RiderChatMessage[];
  onRefresh: () => void;
  scrollViewRef: RefObject<ScrollView | null>;
};

export default function RiderChatMessageList({
  isRefreshing,
  messages,
  onRefresh,
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
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
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
  );
}

const styles = StyleSheet.create({
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
