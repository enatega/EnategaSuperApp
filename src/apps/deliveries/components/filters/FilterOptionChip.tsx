import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export default function FilterOptionChip({ label, isSelected, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: isSelected ? colors.blue100 : colors.surface,
          borderColor: isSelected ? 'transparent' : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        weight="medium"
        color={isSelected ? colors.text : colors.mutedText}
        style={[
          styles.label,
          {
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  label: {
    textAlign: 'center',
  },
});
