import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle: string;
};

export default function BookingListEmptyState({ title, subtitle }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        }}
        weight="bold"
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.mutedText,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
        weight="medium"
      >
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 52,
    rowGap: 6,
  },
});
