import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  value: string;
  isEmphasized?: boolean;
};

export default function OrderDetailsSummaryRow({
  label,
  value,
  isEmphasized = false,
}: Props) {
  const { colors, typography } = useTheme();
  const textColor = isEmphasized ? colors.text : colors.mutedText;
  const fontSize = isEmphasized ? typography.size.md2 : typography.size.sm2;
  const lineHeight = isEmphasized
    ? typography.lineHeight.md2
    : typography.lineHeight.md;

  return (
    <View style={styles.row}>
      <Text
        style={[styles.label, { color: textColor, fontSize, lineHeight }]}
        weight={isEmphasized ? 'semiBold' : 'medium'}
      >
        {label}
      </Text>
      <Text
        style={[styles.value, { color: textColor, fontSize, lineHeight }]}
        weight={isEmphasized ? 'semiBold' : 'medium'}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    flexShrink: 0,
    maxWidth: 120,
    minWidth: 104,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});
