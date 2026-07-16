import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';

type Props = {
  title: string;
  subtitle: string;
  rows: Array<{
    id: string;
    label: string;
    value: number;
    isEmphasized?: boolean;
  }>;
  emptyMessage?: string | null;
};

function ReviewSummarySection({
  emptyMessage,
  rows,
  subtitle,
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const formatRowValue = (value: number) => {
    if (value < 0) {
      return `-${formatPrice(Math.abs(value)) ?? '$0'}`;
    }

    return formatPrice(value) ?? '$0';
  };

  return (
    <View style={styles.section}>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
      >
        {title}
      </Text>
      <Text
        weight="medium"
        style={{
          color: colors.iconMuted,
          fontSize: typography.size.sm,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {subtitle}
      </Text>

      {rows.length > 0 ? (
        <View style={styles.rows}>
          {rows.map((row) => (
            <View key={row.id} style={styles.row}>
              <Text
                weight={row.isEmphasized ? 'bold' : 'medium'}
                style={{
                  color: row.isEmphasized ? colors.text : colors.iconMuted,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {row.label}
              </Text>
              <Text
                weight={row.isEmphasized ? 'bold' : 'medium'}
                style={{
                  color: colors.text,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {formatRowValue(row.value)}
              </Text>
            </View>
          ))}
        </View>
      ) : emptyMessage ? (
        <View
          style={{
            backgroundColor: colors.backgroundTertiary,
            borderColor: colors.border,
            borderRadius: 12,
            borderWidth: 1,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <Text
            weight="medium"
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {emptyMessage}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export default memo(ReviewSummarySection);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rows: {
    gap: 6,
  },
  section: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
