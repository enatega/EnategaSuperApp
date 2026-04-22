import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';
import type { HomeVisitsSelectedServiceSnapshot } from '../../types/teamSchedule';

type Props = {
  title: string;
  subtitle: string;
  services: HomeVisitsSelectedServiceSnapshot[];
  discountCodeLabel: string;
};

function ReviewSummarySection({
  discountCodeLabel,
  services,
  subtitle,
  title,
}: Props) {
  const { colors, typography } = useTheme();

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

      <View style={styles.rows}>
        {services.slice(0, 2).map((service) => (
          <View key={service.id} style={styles.row}>
            <Text
              weight="medium"
              style={{
                color: colors.iconMuted,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {service.name}
            </Text>
            <Text
              weight="medium"
              style={{
                color: colors.iconMuted,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {formatPrice(service.price) ?? '$0'}
            </Text>
          </View>
        ))}

        <View style={styles.row}>
          <Text
            weight="medium"
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {discountCodeLabel}
          </Text>
          <Text
            weight="medium"
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            $0
          </Text>
        </View>
      </View>
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
