import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  isCurrentUser?: boolean;
  text: string;
  timeLabel?: string;
};

export default function ChatMessageBubble({ isCurrentUser = false, text, timeLabel }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, isCurrentUser ? styles.rowRight : styles.rowLeft]}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isCurrentUser ? colors.primary : colors.backgroundTertiary,
            borderColor: isCurrentUser ? colors.primary : 'transparent',
          },
        ]}
      >
        <Text color={isCurrentUser ? colors.white : colors.text}>{text}</Text>
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
