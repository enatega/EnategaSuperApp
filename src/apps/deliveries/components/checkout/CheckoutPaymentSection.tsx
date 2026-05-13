import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import CheckoutInfoRow from './CheckoutInfoRow';

type Props = {
  errorMessage?: string | null;
  isPromoApplied?: boolean;
  onPaymentPress?: () => void;
  onPromoPress?: () => void;
  onPromoRemove?: () => void;
  paymentIconName: React.ComponentProps<typeof CheckoutInfoRow>['iconName'];
  paymentSubtitle?: string | null;
  paymentTitle: string;
  promoCode?: string | null;
  promoTitle?: string | null;
  promoSubtitle?: string | null;
};

export default function CheckoutPaymentSection({
  errorMessage,
  isPromoApplied = false,
  onPaymentPress,
  onPromoPress,
  onPromoRemove,
  paymentIconName,
  paymentSubtitle,
  paymentTitle,
  promoCode,
  promoTitle,
  promoSubtitle,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t('checkout_payment_title')}
        </Text>
      </View>

      <CheckoutInfoRow
        title={paymentTitle}
        subtitle={paymentSubtitle}
        iconName={paymentIconName}
        onPress={onPaymentPress}
      />

      <CheckoutInfoRow
        title={promoTitle ?? t('checkout_promo_title')}
        subtitle={promoSubtitle ?? t('checkout_promo_subtitle')}
        iconName="ticket-outline"
        onPress={onPromoPress}
      />
      {isPromoApplied && promoCode ? (
        <View style={styles.appliedRow}>
          <View style={[styles.codeChip, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <Text color={colors.text} weight="medium" style={styles.codeChipText}>
              {promoCode}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('checkout_promo_remove')}
            onPress={onPromoRemove}
            style={({ pressed }) => [
              styles.removeButton,
              { backgroundColor: colors.backgroundTertiary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text color={colors.text} weight="medium" style={styles.removeText}>
              {t('checkout_promo_remove')}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {errorMessage ? (
        <Text
          style={{
            color: colors.danger,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
            paddingHorizontal: 16,
          }}
        >
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
  },
  appliedRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  codeChip: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 84,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  codeChipText: {
    fontSize: 15,
    lineHeight: 22,
  },
  removeButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 96,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  removeText: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    gap: 4,
    paddingTop: 12,
  },
});
