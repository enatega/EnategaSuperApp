import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import CheckoutInfoRow from './CheckoutInfoRow';

type Props = {
  cashSubtitle?: string;
  errorMessage?: string | null;
  onPaymentPress?: () => void;
  onPromoPress?: () => void;
};

export default function CheckoutPaymentSection({
  cashSubtitle,
  errorMessage,
  onPaymentPress,
  onPromoPress,
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
        title={t('checkout_payment_cash_title')}
        subtitle={cashSubtitle ?? t('checkout_payment_cash_subtitle')}
        iconName="cash-outline"
        onPress={onPaymentPress}
      />

      <CheckoutInfoRow
        title={t('checkout_promo_title')}
        subtitle={t('checkout_promo_subtitle')}
        iconName="ticket-outline"
        onPress={onPromoPress}
      />

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
  section: {
    gap: 4,
    paddingTop: 12,
  },
});
