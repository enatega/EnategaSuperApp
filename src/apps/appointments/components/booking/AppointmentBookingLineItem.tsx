import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  dealLabel?: string | null;
  durationLabel?: string | null;
  metaLabel?: string | null;
  originalPriceLabel?: string | null;
  priceLabel: string;
  title: string;
};

export default function AppointmentBookingLineItem({
  dealLabel,
  durationLabel,
  metaLabel,
  originalPriceLabel,
  priceLabel,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={{ color: colors.text, fontSize: typography.size.md2, lineHeight: typography.lineHeight.md }}
          weight="semiBold"
        >
          {title}
        </Text>

        <View style={styles.metaRow}>
          {durationLabel ? (
            <>
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}>
                {durationLabel}
              </Text>
            </>
          ) : null}

          {metaLabel ? (
            <>
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}>•</Text>
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm2 }}>
                {metaLabel}
              </Text>
            </>
          ) : null}
        </View>
      </View>
      <View style={styles.priceWrap}>
        {originalPriceLabel ? (
          <Text
            style={[
              styles.originalPrice,
              { color: colors.mutedText, fontSize: typography.size.sm2 },
            ]}
          >
            {originalPriceLabel}
          </Text>
        ) : null}
        <Text
          style={{
            color: originalPriceLabel ? colors.primary : colors.text,
            fontSize: typography.size.md2,
          }}
          weight="semiBold"
        >
          {priceLabel}
        </Text>
        {dealLabel ? (
          <Text
            numberOfLines={1}
            style={{ color: colors.primary, fontSize: typography.size.xs }}
            weight="semiBold"
          >
            {dealLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    gap: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  priceWrap: {
    alignItems: 'flex-end',
    gap: 3,
  },
  row: {
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 18,
  },
});
