import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg from '../../../../general/components/Svg';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  message: string;
};

export default function DeliveriesSectionEmptyState({ title, message }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundTertiary,
          borderColor: colors.border,
        },
      ]}
    >
      <Svg name="noResultsFound" width={74} height={74} />
      <Text
        weight="semiBold"
        style={{
          color: colors.text,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.sm2,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          color: colors.mutedText,
          fontSize: typography.size.xs2,
          lineHeight: typography.lineHeight.sm,
          textAlign: 'center',
          maxWidth: 240,
        }}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    justifyContent: 'center',
    minHeight: 180,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
});
