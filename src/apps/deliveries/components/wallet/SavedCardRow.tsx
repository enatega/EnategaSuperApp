import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  brand: 'visa' | 'mastercard';
  holderName: string;
  onPress?: () => void;
};

export default function SavedCardRow({ brand, holderName, onPress }: Props) {
  const { colors } = useTheme();
  const brandLabel = brand === 'visa' ? 'VISA' : 'MC';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`${brand} card ${holderName}`}
    >
      <View style={[styles.brandBadge, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Text weight="bold" color={colors.primary} style={styles.brandText}>
          {brandLabel}
        </Text>
      </View>
      <Text weight="medium" color={colors.text} style={styles.name}>
        {holderName}
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
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 10,
    lineHeight: 14,
  },
  name: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
