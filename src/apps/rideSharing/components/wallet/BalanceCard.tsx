import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Skeleton from '../../../../general/components/Skeleton';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { WalletBalance } from '../../types/wallet';

type Props = {
  balance: WalletBalance;
  balanceLabel: string;
  addFundsLabel: string;
  isLoading?: boolean;
  onAddFunds: () => void;
};

export default function BalanceCard({
  balance,
  balanceLabel,
  addFundsLabel,
  isLoading = false,
  onAddFunds,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
      <View style={styles.content}>
        <Text
          variant="caption"
          weight="medium"
          color={colors.text}
          style={{ fontSize: typography.size.xs2, lineHeight: typography.lineHeight.xxs }}
        >
          {balanceLabel}
        </Text>
        <Text
          variant="title"
          weight="bold"
          color={colors.text}
          style={{ fontSize: 32, lineHeight: 38, letterSpacing: -0.48 }}
        >
          {isLoading ? null : `${balance.currency} ${balance.amount.toFixed(2)}`}
        </Text>
        {isLoading ? (
          <Skeleton
            width={220}
            height={38}
            borderRadius={10}
          />
        ) : null}
      </View>
      <Pressable
        onPress={onAddFunds}
        disabled={isLoading}
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor: colors.findingRidePrimary,
            opacity: isLoading ? 0.6 : pressed ? 0.85 : 1,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={addFundsLabel}
      >
        <Ionicons name="add" size={20} color={colors.white} />
        <Text variant="body" weight="medium" color={colors.white}>
          {addFundsLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 16,
    gap: 24,
  },
  content: {
    gap: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: 6,
    paddingHorizontal: 16,
  },
});
