import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  title: string;
  primaryText?: string | null;
  secondaryText?: string | null;
  primaryWeight?: 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold';
};

export default function BookingDetailsTextSection({
  primaryText,
  primaryWeight = 'medium',
  secondaryText,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg2,
        }}
        weight="bold"
      >
        {title}
      </Text>
      {primaryText ? (
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight={primaryWeight}
        >
          {primaryText}
        </Text>
      ) : null}
      {secondaryText ? (
        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {secondaryText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 14,
  },
});
