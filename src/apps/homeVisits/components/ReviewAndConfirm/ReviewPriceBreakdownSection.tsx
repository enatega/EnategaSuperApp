import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';
import ReviewSectionCard from './ReviewSectionCard';

type Row = {
  id: string;
  label: string;
  value: string;
  emphasize?: boolean;
};

type Props = {
  title: string;
  rows: Row[];
};

function ReviewPriceBreakdownSection({ rows, title }: Props) {
  const { colors, typography } = useTheme();

  return (
    <ReviewSectionCard>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>

      <View style={[styles.rows, { borderTopColor: colors.border }]}>
        {rows.map((row) => (
          <View key={row.id} style={styles.row}>
            <Text
              weight={row.emphasize ? 'bold' : 'medium'}
              style={{
                color: row.emphasize ? colors.text : colors.iconMuted,
                flex: 1,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {row.label}
            </Text>
            <Text
              weight={row.emphasize ? 'bold' : 'medium'}
              style={{
                color: colors.text,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </ReviewSectionCard>
  );
}

export function createReviewPriceRows(params: {
  selectedServicesTotal: number;
  workersCharges: number;
  total: number;
  selectedServicesLabel: string;
  workersChargesLabel: string;
  totalLabel: string;
}) {
  return [
    {
      id: 'services',
      label: params.selectedServicesLabel,
      value: formatPrice(params.selectedServicesTotal) ?? '$0',
    },
    {
      id: 'workers',
      label: params.workersChargesLabel,
      value: formatPrice(params.workersCharges) ?? '$0',
    },
    {
      id: 'total',
      label: params.totalLabel,
      value: formatPrice(params.total) ?? '$0',
      emphasize: true,
    },
  ] as Row[];
}

export default memo(ReviewPriceBreakdownSection);

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rows: {
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 10,
  },
});
