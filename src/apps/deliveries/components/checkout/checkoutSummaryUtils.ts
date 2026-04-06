import type {
  CheckoutOrderType,
  CheckoutPreviewPricing,
} from '../../api/orderServiceTypes';

export type CheckoutSummaryLineItem = {
  key: string;
  label: string;
  tone?: 'default' | 'success';
  value: number;
};

type BuildCheckoutSummaryLineItemsInput = {
  orderType: CheckoutOrderType;
  pricing: CheckoutPreviewPricing;
  t: (key: string) => string;
};

const hasValue = (value: number) => Math.abs(value) > 0.0001;

export function buildCheckoutSummaryLineItems({
  orderType,
  pricing,
  t,
}: BuildCheckoutSummaryLineItemsInput): CheckoutSummaryLineItem[] {
  const items: CheckoutSummaryLineItem[] = [
    {
      key: 'subtotal',
      label: t('checkout_summary_subtotal'),
      value: pricing.subtotal,
    },
  ];

  if (hasValue(pricing.discount)) {
    items.push({
      key: 'discount',
      label: t('checkout_summary_discount'),
      tone: 'success',
      value: pricing.discount,
    });
  }

  if (hasValue(pricing.packingCharges)) {
    items.push({
      key: 'packingCharges',
      label: t('checkout_summary_packing_charges'),
      value: pricing.packingCharges,
    });
  }

  if (orderType === 'delivery' || hasValue(pricing.deliveryFee)) {
    items.push({
      key: 'deliveryFee',
      label: t('checkout_summary_delivery_fee'),
      value: pricing.deliveryFee,
    });
  }

  if (hasValue(pricing.tax)) {
    items.push({
      key: 'tax',
      label: t('checkout_summary_tax'),
      value: pricing.tax,
    });
  }

  if (hasValue(pricing.riderTip)) {
    items.push({
      key: 'riderTip',
      label: t('checkout_summary_tip'),
      value: pricing.riderTip,
    });
  }

  return items;
}
