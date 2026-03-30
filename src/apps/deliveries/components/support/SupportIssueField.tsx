import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  hasValue?: boolean;
  isExpanded?: boolean;
  label: string;
  onPress?: () => void;
};

export default function SupportIssueField({
  hasValue = false,
  isExpanded = false,
  label,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        color={hasValue ? colors.text : colors.mutedText}
        style={[styles.label, { fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }]}
      >
        {label}
      </Text>

      <Ionicons
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        size={24}
        color={colors.iconMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  label: {
    flexShrink: 1,
  },
});
