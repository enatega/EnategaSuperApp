import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  balance: number | null | undefined;
  balanceLabel: string;
  buttonLabel: string;
  onPressWallet?: () => void;
};

export default function WalletCard({
  balance,
  balanceLabel,
  buttonLabel,
  onPressWallet,
}: Props) {
  const { colors } = useTheme();
  const formattedBalance = `$${(balance ?? 0).toLocaleString()}`;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[colors.bannerGradientStart, colors.bannerGradientEnd]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={styles.gradient}
      >
        {/* Balance info row — fills width, pushes button to the right */}
        <View style={styles.row}>
          <View style={styles.balanceSection}>
            <Text weight="medium" color={colors.white} style={styles.label}>
              {balanceLabel}
            </Text>
            <Text weight="bold" color={colors.white} style={styles.amount}>
              {formattedBalance}
            </Text>
          </View>
        </View>

        {/* Button pinned bottom-right */}
        <View style={styles.buttonRow}>
          <Pressable
            onPress={onPressWallet}
            accessibilityRole="button"
            accessibilityLabel={buttonLabel}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text weight="medium" color={colors.text} style={styles.buttonText}>
              {buttonLabel}
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 18,
    letterSpacing: -0.27,
    lineHeight: 22,
  },
  balanceSection: {
    flex: 1,
    gap: 6,
  },
  button: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonRow: {
    alignItems: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 16,
  },
  gradient: {
    borderRadius: 12,
    gap: 24,
    height: 156,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 16,
  },
  label: {
    fontSize: 14,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    gap: 9,
  },
  wrapper: {
    paddingHorizontal: 16,
  },
});
