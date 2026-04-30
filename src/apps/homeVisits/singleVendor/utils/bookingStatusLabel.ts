import { normalizeJobStatus } from './trackWorkerStatus';

function toTitleCase(value: string) {
  return value
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function resolveBookingStatusLabel(
  jobStatus: string | null | undefined,
  fallbackStatusLabel: string | null | undefined,
  t: (key: string) => string,
) {
  const normalized = normalizeJobStatus(jobStatus);

  if (normalized === 'confirmed') {
    return t('single_vendor_booking_status_confirmed');
  }

  if (normalized) {
    return toTitleCase(normalized);
  }

  if (fallbackStatusLabel && fallbackStatusLabel.trim().length > 0) {
    return fallbackStatusLabel;
  }

  return t('single_vendor_booking_status_confirmed');
}

