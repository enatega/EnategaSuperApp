import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  label: string;
  onPress: () => void;
};

export default function AddCardRow({ label, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.iconWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Ionicons name="card-outline" size={22} color={colors.mutedText} />
      </View>
      <Text weight="medium" color={colors.text} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
