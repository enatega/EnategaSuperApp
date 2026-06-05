import type { CheckoutPreviewStore } from '../../api/orderServiceTypes';

export function getCheckoutStandardEtaLabel(
  store: CheckoutPreviewStore | null | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  const instantDeliveryTime = store?.instantDeliveryTime;

  if (
    store?.isInstantDelivery === false
    && typeof instantDeliveryTime === 'number'
    && Number.isFinite(instantDeliveryTime)
    && instantDeliveryTime > 0
  ) {
    const roundedDays = Math.round(instantDeliveryTime);
    return roundedDays === 1
      ? t('checkout_delivery_time_eta_day_single', { count: roundedDays })
      : t('checkout_delivery_time_eta_day_plural', { count: roundedDays });
  }

  return t('checkout_delivery_time_standard_eta');
}

export function isCheckoutScheduleAvailable(store: CheckoutPreviewStore | null | undefined) {
  if (!store) {
    return false;
  }

  return store.scheduleAllowed && store.isInstantDelivery !== false;
}
