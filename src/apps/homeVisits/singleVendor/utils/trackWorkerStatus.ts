import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';

export type HomeServicesJobStatus =
  | 'scheduled'
  | 'pending'
  | 'confirmed'
  | 'worker_assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'failed';

export type TrackWorkerStage =
  | 'preparing'
  | 'on_way'
  | 'anytime_now'
  | 'service_started'
  | 'payment'
  | 'payment_confirmed'
  | 'feedback'
  | 'cancelled'
  | 'failed';

export function normalizeJobStatus(value?: string | null): HomeServicesJobStatus | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  switch (normalized) {
    case 'scheduled':
    case 'pending':
    case 'confirmed':
    case 'worker_assigned':
    case 'in_progress':
    case 'completed':
    case 'cancelled':
    case 'rejected':
    case 'failed':
      return normalized;
    default:
      return null;
  }
}

function normalizePaymentStatus(value?: string | null) {
  if (!value) {
    return '';
  }

  return value.trim().toLowerCase();
}

export function resolveTrackWorkerStage(
  details?: HomeVisitsSingleVendorBookingDetails | null,
): TrackWorkerStage {
  const status = normalizeJobStatus(details?.jobStatus ?? details?.status);
  const statusMessage = `${details?.statusMessage ?? ''}`.toLowerCase();
  const paymentStatus = normalizePaymentStatus(details?.paymentStatus);

  if (paymentStatus === 'paid' || paymentStatus === 'completed' || paymentStatus === 'success') {
    return 'payment_confirmed';
  }

  switch (status) {
    case 'scheduled':
    case 'pending':
    case 'confirmed':
      return 'preparing';
    case 'worker_assigned':
      if (statusMessage.includes('anytime')) {
        return 'anytime_now';
      }
      return 'on_way';
    case 'in_progress':
      return 'service_started';
    case 'completed':
      return 'payment';
    case 'cancelled':
    case 'rejected':
      return 'cancelled';
    case 'failed':
      return 'failed';
    default:
      return 'preparing';
  }
}

export function getProgressStep(stage: TrackWorkerStage) {
  switch (stage) {
    case 'on_way':
      return 2;
    case 'anytime_now':
    case 'service_started':
      return 3;
    case 'payment':
    case 'payment_confirmed':
    case 'feedback':
      return 4;
    default:
      return 1;
  }
}
