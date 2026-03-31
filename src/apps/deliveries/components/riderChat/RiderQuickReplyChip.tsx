import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

export default function RiderQuickReplyChip({ disabled = false, label, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.findingRidePrimary,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1,
        },
      ]}
    >
      <Text
        weight="medium"
        color={colors.text}
        style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1.5,
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
