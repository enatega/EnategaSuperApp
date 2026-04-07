import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { PaymentCard } from '../../types/wallet';

type Props = {
  card: PaymentCard | null;
  onPress: () => void;
};

export default function PaymentMethodRow({ card, onPress }: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.7 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Choose payment method"
    >
      <View style={styles.left}>
        <View style={[styles.cardIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text variant="caption" style={{ fontSize: 10 }}>
            {card?.brand === 'mastercard' ? '🟠' : '💳'}
          </Text>
        </View>
        <Text variant="body" weight="medium" color={colors.text}>
          **** {card?.lastFour ?? '----'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.mutedText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcon: {
    width: 34,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
