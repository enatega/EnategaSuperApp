import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

export default function SupportTopicItem({ iconName, label, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={styles.leftContent}>
        <Ionicons name={iconName} size={26} color={colors.iconColor} />
        <Text
          color={colors.text}
          weight="medium"
          style={[styles.label, { fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }]}
        >
          {label}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={24} color={colors.iconMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingVertical: 6,
  },
  label: {
    flexShrink: 1,
  },
  leftContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
});
