import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  sender: 'rider' | 'user';
  text: string;
  timeLabel?: string;
};

export default function RiderChatMessageBubble({ sender, text, timeLabel }: Props) {
  const { colors } = useTheme();
  const isUser = sender === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.rowRight : styles.rowLeft]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser ? colors.primary : colors.backgroundTertiary,
            borderColor: isUser ? colors.primary : 'transparent',
          },
        ]}
      >
        <Text color={isUser ? colors.white : colors.text}>{text}</Text>
      </View>
      {timeLabel ? (
        <Text color={colors.mutedText} style={styles.timeLabel}>
          {timeLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: '78%',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    alignItems: 'flex-start',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 14,
    marginTop: 10,
  },
  wrapper: {
    gap: 0,
  },
});
