import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type {
  CheckoutOrderType,
  CheckoutPreviewPricing,
} from '../../api/orderServiceTypes';
import { formatCartPrice } from '../cart/cartUtils';
import CheckoutSummaryLine from './CheckoutSummaryLine';
import { buildCheckoutSummaryLineItems } from './checkoutSummaryUtils';

type Props = {
  orderType: CheckoutOrderType;
  pricing: CheckoutPreviewPricing;
  totalLabel: string;
};

export default function CheckoutSummaryDetails({
  orderType,
  pricing,
  totalLabel,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const lineItems = React.useMemo(
    () => buildCheckoutSummaryLineItems({ orderType, pricing, t }),
    [orderType, pricing, t],
  );

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: colors.border,
        },
      ]}
    >
      <View style={styles.items}>
        {lineItems.map((item) => (
          <CheckoutSummaryLine
            key={item.key}
            label={item.label}
            tone={item.tone}
            valueLabel={
              item.key === 'discount'
                ? `- ${formatCartPrice(item.value)}`
                : item.key === 'deliveryFee' && item.value === 0
                  ? t('checkout_summary_free')
                  : formatCartPrice(item.value)
            }
          />
        ))}
      </View>

      <View
        style={[
          styles.totalRow,
          {
            borderTopColor: colors.border,
          },
        ]}
      >
        <Text
          weight="semiBold"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('checkout_summary_total')}
        </Text>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {totalLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    gap: 14,
    paddingTop: 14,
  },
  items: {
    gap: 10,
  },
  totalRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
});
