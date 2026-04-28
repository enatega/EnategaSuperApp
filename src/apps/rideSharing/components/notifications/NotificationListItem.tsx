import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { UserNotificationItem } from '../../api/userService';

type Props = {
  notification: UserNotificationItem;
  timeLabel: string;
  onPress: (notification: UserNotificationItem) => void;
};

export default function NotificationListItem({
  notification,
  timeLabel,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={notification.title}
      onPress={() => onPress(notification)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.surfaceSoft,
          },
        ]}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.iconMuted}
        />
      </View>

      <View style={styles.messageColumn}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {notification.title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
            marginTop: 2,
          }}
          weight="medium"
        >
          {timeLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  messageColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  rowPressed: {
    opacity: 0.7,
  },
});
