import { getRideSharingCurrencyLabel } from '../../../general/stores/useAppConfigStore';

export function formatRideCurrency(value: number | undefined) {
  const currencyLabel = getRideSharingCurrencyLabel();

  if (typeof value !== 'number' || Number.isNaN(value)) {
    return `${currencyLabel} 0.00`;
  }

  return `${currencyLabel} ${value.toFixed(2)}`;
}

export function formatRideEstimate(value: number | undefined) {
  return `~${formatRideCurrency(value)}`;
}
