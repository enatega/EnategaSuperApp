import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  label: string;
  tone: 'warning' | 'success' | 'danger';
};

export default function OrderDetailsStatusBadge({ label, tone }: Props) {
  const { colors, typography } = useTheme();

  const palette =
    tone === 'success'
      ? {
          backgroundColor: colors.successSoft,
          textColor: colors.successText,
        }
      : tone === 'danger'
        ? {
            backgroundColor: colors.dangerSoft,
            textColor: colors.dangerText,
          }
        : {
            backgroundColor: colors.warningSoft,
            textColor: colors.warningText,
          };

  return (
    <View style={[styles.badge, { backgroundColor: palette.backgroundColor }]}>
      <Text
        style={{
          color: palette.textColor,
          fontSize: typography.size.xs2,
          lineHeight: typography.lineHeight.sm,
        }}
        weight="medium"
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
