import type { TFunction } from 'i18next';
import type {
  CheckoutPaymentMethod,
  CheckoutPreviewStore,
} from '../../api/orderServiceTypes';

export function getCheckoutPaymentMethodTitle(
  paymentMethod: CheckoutPaymentMethod,
  t: TFunction<'deliveries'>,
) {
  if (paymentMethod === 'stripe') return t('checkout_payment_card_title');
  if (paymentMethod === 'wallet') return t('checkout_payment_wallet_title');
  return t('checkout_payment_cash_title');
}

export function getCheckoutPaymentMethodSubtitle(
  paymentMethod: CheckoutPaymentMethod,
  t: TFunction<'deliveries'>,
) {
  if (paymentMethod === 'stripe') return t('checkout_payment_card_subtitle');
  if (paymentMethod === 'wallet') return t('checkout_payment_wallet_subtitle');
  return t('checkout_payment_cash_subtitle');
}

export function isCheckoutPaymentMethodAvailable(
  paymentMethod: CheckoutPaymentMethod,
  store?: CheckoutPreviewStore | null,
  walletBalance = 0,
  totalAmount = 0,
) {
  if (paymentMethod === 'wallet') {
    return totalAmount > 0 && walletBalance >= totalAmount;
  }

  if (!store) {
    return true;
  }

  return paymentMethod === 'stripe' ? store.stripeAllowed : store.codAllowed;
}

export function getPreferredCheckoutPaymentMethod(
  store?: CheckoutPreviewStore | null,
  walletBalance = 0,
  totalAmount = 0,
): CheckoutPaymentMethod {
  if (!store) {
    return 'cod';
  }

  if (store.codAllowed) {
    return 'cod';
  }

  if (store.stripeAllowed) {
    return 'stripe';
  }

  if (totalAmount > 0 && walletBalance >= totalAmount) {
    return 'wallet';
  }

  return 'cod';
}
