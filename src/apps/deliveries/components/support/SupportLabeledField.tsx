import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  children: React.ReactNode;
  helperText?: string;
  isRequired?: boolean;
  label: string;
};

export default function SupportLabeledField({
  children,
  helperText,
  isRequired = false,
  label,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.labelWrap}>
        <View style={styles.labelRow}>
          <Text
            color={colors.text}
            weight="medium"
            style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
          >
            {label}
          </Text>
          {isRequired ? (
            <Text
              color={colors.danger}
              weight="medium"
              style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
            >
              *
            </Text>
          ) : null}
        </View>

        {helperText ? (
          <Text
            color={colors.mutedText}
            weight="medium"
            style={{ fontSize: typography.size.xs2, lineHeight: 18 }}
          >
            {helperText}
          </Text>
        ) : null}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
    width: '100%',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 2,
  },
  labelWrap: {
    gap: 2,
  },
});
