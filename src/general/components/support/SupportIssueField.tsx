import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  label: string;
  onPress: () => void;
  hasValue?: boolean;
  isExpanded?: boolean;
};

export default function SupportIssueField({
  label,
  onPress,
  hasValue = false,
  isExpanded = false,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: pressed ? 0.76 : 1,
        },
      ]}
    >
      <Text
        color={hasValue ? colors.text : colors.mutedText}
        style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
        weight="medium"
      >
        {label}
      </Text>
      <View style={styles.iconWrap}>
        <Ionicons
          color={colors.iconMuted}
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
        />
      </View>
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
    paddingHorizontal: 14,
  },
  iconWrap: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
});
