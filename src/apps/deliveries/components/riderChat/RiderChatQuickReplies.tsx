import React from 'react';
import { StyleSheet, View } from 'react-native';
import RiderQuickReplyChip from './RiderQuickReplyChip';

type Props = {
  disabled?: boolean;
  onPressReply: (label: string) => void;
  replies: string[];
};

export default function RiderChatQuickReplies({
  disabled = false,
  onPressReply,
  replies,
}: Props) {
  return (
    <View style={styles.container}>
      {replies.map((reply) => (
        <RiderQuickReplyChip
          key={reply}
          disabled={disabled}
          label={reply}
          onPress={() => onPressReply(reply)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
});
