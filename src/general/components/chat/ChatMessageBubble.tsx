import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  isCurrentUser?: boolean;
  text: string;
  timeLabel?: string;
};

export default function ChatMessageBubble({ isCurrentUser = false, text, timeLabel }: Props) {
  const { colors, typography } = useTheme();

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
        <Text
          color={isCurrentUser ? colors.white : colors.text}
          style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
        >
          {text}
        </Text>
      </View>
      {timeLabel ? (
        <Text color={colors.mutedText} style={[styles.timeLabel, { fontSize: typography.size.xs2, lineHeight: typography.lineHeight.sm }]}>
          {timeLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 12,
    borderWidth: 1,
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rowLeft: {
    alignItems: 'flex-start',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  timeLabel: {
    marginTop: 6,
  },
  wrapper: {
    gap: 0,
  },
});
