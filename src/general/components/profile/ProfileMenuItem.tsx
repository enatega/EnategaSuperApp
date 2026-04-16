import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
};

export default function ProfileMenuItem({ icon, label, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.background, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.left}>
        {icon}
        <Text weight="medium" style={styles.label}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.mutedText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
  },
  left: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
});
