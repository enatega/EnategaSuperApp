import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  amount: number;
  currency: string;
  paymentMethod: 'cash' | 'card';
};

export default function ReservationPayment({ amount, currency, paymentMethod }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        Payment
      </Text>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.cardMint }]}>
          <Ionicons name="cash-outline" size={24} color={colors.success} />
        </View>
        <Text weight="semiBold" variant="subtitle">
          {currency} {amount.toFixed(2)}
        </Text>
        <Text variant="caption" color={colors.mutedText} style={styles.method}>
          {paymentMethod === 'cash' ? 'Cash' : 'Card'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  label: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  method: {
    marginLeft: 8,
  },
});
