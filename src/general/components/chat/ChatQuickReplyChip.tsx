import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
};

export default function ChatQuickReplyChip({ disabled = false, label, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: colors.background,
          borderColor: colors.findingRidePrimary,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
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
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
