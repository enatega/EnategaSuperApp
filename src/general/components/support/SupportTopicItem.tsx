import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
};

export default function SupportTopicItem({ iconName, label, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <View style={styles.leftContent}>
        <Ionicons
          color={colors.iconColor}
          name={iconName}
          size={26}
        />
        <Text
          color={colors.text}
          style={[styles.label, { fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }]}
          weight="medium"
        >
          {label}
        </Text>
      </View>

      <Ionicons
        color={colors.iconMuted}
        name="chevron-forward"
        size={24}
      />
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
