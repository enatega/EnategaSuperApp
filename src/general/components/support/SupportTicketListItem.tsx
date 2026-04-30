import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

export type SupportTicketStatusTone = 'success' | 'info' | 'danger';

type Props = {
  dateLabel: string;
  dayNumber: string;
  onPress?: () => void;
  orderIdLabel?: string;
  preview: string;
  statusLabel: string;
  statusTone: SupportTicketStatusTone;
  title: string;
  unreadCount?: number;
};

export default function SupportTicketListItem({
  dateLabel,
  dayNumber,
  onPress,
  orderIdLabel,
  preview,
  statusLabel,
  statusTone,
  title,
  unreadCount,
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
            style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
            weight="medium"
          >
            {dayNumber}
          </Text>
          <Text
            color={colors.mutedText}
            style={{ fontSize: typography.size.xs2, lineHeight: 15 }}
            weight="medium"
          >
            {dateLabel}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.textColumn}>
          <Text
            color={colors.text}
            numberOfLines={2}
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
            weight="semiBold"
          >
            {title}
          </Text>
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            weight="medium"
          >
            {preview}
          </Text>
        </View>

        {typeof unreadCount === 'number' ? (
          <View style={[styles.countBadge, { backgroundColor: colors.blue800 }]}>
            <Text
              color={colors.white}
              style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
              weight="medium"
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
              style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
              weight="medium"
            >
              {orderIdLabel}
            </Text>
          </View>
        ) : null}

        <View style={[styles.chip, { backgroundColor: resolvedStatusStyle.backgroundColor }]}>
          <Text
            color={resolvedStatusStyle.color}
            style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
            weight="medium"
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
    flexShrink: 0,
    justifyContent: 'center',
    minWidth: 20,
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

