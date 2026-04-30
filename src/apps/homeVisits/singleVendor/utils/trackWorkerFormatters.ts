import type { TrackWorkerStage } from './trackWorkerStatus';

export function isMapStage(stage: TrackWorkerStage) {
  return stage === 'on_way' || stage === 'anytime_now';
}

export function isContactVisible(stage: TrackWorkerStage) {
  return stage === 'preparing' || stage === 'on_way' || stage === 'anytime_now';
}

export function resolvePaymentMethodLabel(method: string | null | undefined, t: (key: string) => string) {
  const normalized = `${method ?? ''}`.toLowerCase();

  if (normalized.includes('card')) {
    return '**** 9432';
  }

  if (normalized.includes('online')) {
    return t('single_vendor_track_worker_online_payment');
  }

  return t('single_vendor_track_worker_online_payment');
}

export function formatAmount(value?: number | string | null) {
  const numericValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return '$-';
  }

  return `$${numericValue.toFixed(2)}`;
}
