import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  amountLabel: string;
  disabled?: boolean;
  itemCount: number;
  onCheckoutPress: () => void;
};

export default function CartFooter({
  amountLabel,
  disabled = false,
  itemCount,
  onCheckoutPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onCheckoutPress}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: disabled ? colors.backgroundTertiary : colors.primary,
            opacity: disabled ? 1 : pressed ? 0.88 : 1,
          },
        ]}
      >
        <View style={styles.buttonContent}>
          <View
            style={[
              styles.countBadge,
              { backgroundColor: disabled ? colors.surfaceSoft : colors.white },
            ]}
          >
            <Text
              weight="semiBold"
              style={{
                color: disabled ? colors.mutedText : colors.primary,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {itemCount}
            </Text>
          </View>

          <Text
            weight="semiBold"
            style={{
              color: disabled ? colors.mutedText : colors.white,
              flex: 1,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {t('cart_checkout')}
          </Text>

          <Text
            weight="semiBold"
            style={{
              color: disabled ? colors.mutedText : colors.white,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {amountLabel}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  buttonContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  countBadge: {
    alignItems: 'center',
    borderRadius: 999,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
});
