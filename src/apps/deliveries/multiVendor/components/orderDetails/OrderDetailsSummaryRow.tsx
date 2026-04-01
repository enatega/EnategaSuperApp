import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

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

  return (
    <View style={styles.row}>
      <Text
        style={{
          color: isEmphasized ? colors.text : colors.mutedText,
          flex: 1,
          fontSize: isEmphasized ? typography.size.md2 : typography.size.sm2,
          lineHeight: isEmphasized
            ? typography.lineHeight.md2
            : typography.lineHeight.md,
        }}
        weight={isEmphasized ? 'semiBold' : 'medium'}
      >
        {label}
      </Text>
      <Text
        style={{
          color: isEmphasized ? colors.text : colors.mutedText,
          fontSize: isEmphasized ? typography.size.md2 : typography.size.sm2,
          lineHeight: isEmphasized
            ? typography.lineHeight.md2
            : typography.lineHeight.md,
          marginLeft: 16,
          textAlign: 'right',
        }}
        weight={isEmphasized ? 'semiBold' : 'medium'}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
