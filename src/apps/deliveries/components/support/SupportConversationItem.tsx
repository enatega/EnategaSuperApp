import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import type { ThemeColors } from '../../../../general/theme/colors';
import { useTheme } from '../../../../general/theme/theme';
import SupportConversationAvatar from './SupportConversationAvatar';

type Props = {
  avatarTone: keyof ThemeColors;
  avatarLabel: string;
  dateLabel: string;
  message: string;
  name: string;
  onPress?: () => void;
  unreadCount?: number;
};

export default function SupportConversationItem({
  avatarTone,
  avatarLabel,
  dateLabel,
  message,
  name,
  onPress,
  unreadCount,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={name}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.background },
        { opacity: pressed ? 0.74 : 1 },
      ]}
    >
      <SupportConversationAvatar backgroundColorToken={avatarTone} label={avatarLabel} />

      <View style={styles.content}>
        <Text
          color={colors.text}
          weight="semiBold"
          style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          color={colors.mutedText}
          weight="medium"
          style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
          numberOfLines={1}
        >
          {message}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text
          color={colors.mutedText}
          style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
        >
          {dateLabel}
        </Text>

        {unreadCount ? (
          <View style={[styles.badge, { backgroundColor: colors.backgroundTertiary }]}>
            <Text
              color={colors.mutedText}
              weight="medium"
              style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            >
              {String(unreadCount)}
            </Text>
          </View>
        ) : (
          <View style={styles.badgeSpacer} />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 4,
    minWidth: 16,
    paddingHorizontal: 6,
  },
  badgeSpacer: {
    height: 18,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  meta: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
});
