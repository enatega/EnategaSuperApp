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

  if (normalized) {
    switch (normalized) {
      case 'confirmed':
        return t('single_vendor_booking_status_confirmed');
      case 'worker_assigned':
        return 'Worker Assigned';
      case 'on_my_way':
        return 'On My Way';
      case 'reached':
        return 'Reached';
      case 'job_started':
      case 'service_started':
      case 'in_progress':
        return 'Service Started';
      case 'marked_complete':
        return 'Marked Complete';
      case 'payment_requested':
        return 'Payment Requested';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      case 'scheduled':
        return 'Scheduled';
      default:
        break;
    }

    return toTitleCase(normalized);
  }

  if (fallbackStatusLabel && fallbackStatusLabel.trim().length > 0) {
    return fallbackStatusLabel;
  }

  return t('single_vendor_booking_status_confirmed');
}
