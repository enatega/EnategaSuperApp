import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  tone?: 'default' | 'success';
  valueLabel: string;
};

export default function CheckoutSummaryLine({
  label,
  tone = 'default',
  valueLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const resolvedColor = tone === 'success' ? colors.success : colors.mutedText;

  return (
    <View style={styles.row}>
      <Text
        style={{
          color: resolvedColor,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {label}
      </Text>
      <Text
        weight="medium"
        style={{
          color: resolvedColor,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {valueLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
