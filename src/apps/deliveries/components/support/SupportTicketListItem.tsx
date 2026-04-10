import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  dateLabel: string;
  dayNumber: string;
  orderIdLabel?: string;
  preview: string;
  statusLabel: string;
  statusTone: 'success' | 'info' | 'danger';
  title: string;
  unreadCount?: number;
  onPress?: () => void;
};

export default function SupportTicketListItem({
  dateLabel,
  dayNumber,
  orderIdLabel,
  preview,
  statusLabel,
  statusTone,
  title,
  unreadCount,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();
  const statusStyles = {
    danger: { backgroundColor: colors.red100, color: colors.danger },
    info: { backgroundColor: colors.blue100, color: colors.blue500 },
    success: { backgroundColor: colors.green100, color: colors.success },
  } as const;
  const resolvedStatusStyle = statusStyles[statusTone];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: pressed ? 0.94 : 1,
        },
      ]}
    >
      <View style={[styles.topRow, { borderBottomColor: colors.border }]}>
        <View style={styles.dateColumn}>
          <Text
            color={colors.text}
            weight="medium"
            style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
          >
            {dayNumber}
          </Text>
          <Text
            color={colors.mutedText}
            weight="medium"
            style={{ fontSize: typography.size.xs2, lineHeight: 15 }}
          >
            {dateLabel}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.textColumn}>
          <Text
            color={colors.text}
            weight="semiBold"
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text
            color={colors.mutedText}
            weight="medium"
            style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {preview}
          </Text>
        </View>

        {typeof unreadCount === 'number' ? (
          <View style={[styles.countBadge, { backgroundColor: colors.blue800 }]}>
            <Text
              color={colors.white}
              weight="medium"
              style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            >
              {String(unreadCount)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        {orderIdLabel ? (
          <View style={[styles.chip, { backgroundColor: colors.gray100 }]}>
            <Text
              color={colors.mutedText}
              weight="medium"
              style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            >
              {orderIdLabel}
            </Text>
          </View>
        ) : null}

        <View style={[styles.chip, { backgroundColor: resolvedStatusStyle.backgroundColor }]}>
          <Text
            color={resolvedStatusStyle.color}
            weight="medium"
            style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
          >
            {statusLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
  },
  card: {
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 16,
    width: '100%',
  },
  chip: {
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  countBadge: {
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
    minWidth: 20,
    flexShrink: 0,
    paddingHorizontal: 6,
  },
  dateColumn: {
    alignItems: 'center',
    flexShrink: 0,
    width: 32,
  },
  divider: {
    flexShrink: 0,
    height: 40,
    width: StyleSheet.hairlineWidth,
  },
  textColumn: {
    flex: 1,
    flexShrink: 1,
    gap: 1,
    minWidth: 0,
  },
  topRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
  },
});
