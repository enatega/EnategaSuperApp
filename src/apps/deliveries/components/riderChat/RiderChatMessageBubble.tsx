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
  const { colors, typography } = useTheme();
  const isCurrentUser = sender === 'user';

  return (
    <View style={[styles.wrapper, isCurrentUser ? styles.currentUserRow : styles.riderRow]}>
      <View
        style={[
          styles.bubble,
          isCurrentUser ? styles.currentUserBubble : styles.riderBubble,
          {
            backgroundColor: isCurrentUser ? colors.primary : colors.backgroundTertiary,
          },
        ]}
      >
        <Text
          color={isCurrentUser ? colors.white : colors.text}
          style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.lg }}
        >
          {text}
        </Text>
      </View>
      {timeLabel ? (
        <Text
          color={colors.mutedText}
          style={[
            styles.timeLabel,
            {
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
              textAlign: isCurrentUser ? 'right' : 'left',
            },
          ]}
        >
          {timeLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: 240,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currentUserBubble: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  currentUserRow: {
    alignItems: 'flex-end',
  },
  riderBubble: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  riderRow: {
    alignItems: 'flex-start',
  },
  timeLabel: {
    marginTop: 6,
    minWidth: 64,
  },
  wrapper: {
    gap: 0,
  },
});
