import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useRideSharingCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import type { Transaction } from '../../types/wallet';

type Props = {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
};

export default function TransactionItem({ transaction, onPress }: Props) {
  const { colors, typography } = useTheme();
  const currencyLabel = useRideSharingCurrencyLabel();

  const amountPrefix = transaction.isCredit ? '+ ' : '- ';
  const formattedAmount = `${amountPrefix}${currencyLabel} ${transaction.amount.toFixed(2)}`;

  return (
    <Pressable
      onPress={() => onPress?.(transaction)}
      style={({ pressed }) => [styles.container, { opacity: pressed ? 0.7 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.title} ${formattedAmount}`}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.surfaceSoft }]}>
        <Text
          variant="caption"
          weight="medium"
          color={colors.mutedText}
          style={{ fontSize: 10 }}
        >
          {transaction.type === 'topup' ? '💳' : '🚗'}
        </Text>
      </View>

      <View style={styles.details}>
        <Text
          variant="body"
          weight="medium"
          color={colors.text}
          style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
        >
          {transaction.title}
        </Text>
        <Text
          variant="caption"
          weight="medium"
          color={colors.mutedText}
          style={{ fontSize: typography.size.xs2, lineHeight: typography.lineHeight.xxs }}
        >
          {transaction.date}
        </Text>
      </View>

      <View style={styles.amountRow}>
        <Text
          variant="caption"
          weight="medium"
          color={colors.text}
          style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.sm }}
        >
          {formattedAmount}
        </Text>
        <Ionicons name="chevron-forward" size={24} color={colors.mutedText} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 64,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
