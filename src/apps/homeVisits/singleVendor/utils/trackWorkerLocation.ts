import type { LatLng } from 'react-native-maps';
import type {
  JobStatusUpdatedEvent,
  WorkerLocationEvent,
} from '../../socket/homeServicesSocket.types';
import type { HomeVisitsSingleVendorBookingDetails } from '../api/types';

export function readString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function toLatLng(value: unknown): LatLng | null {
  const record = asRecord(value);

  if (!record) {
    return null;
  }

  const latitude = asNumber(record.latitude ?? record.lat);
  const longitude = asNumber(record.longitude ?? record.lng ?? record.lon);

  if (latitude === null || longitude === null) {
    return null;
  }

  return { latitude, longitude };
}

export function extractDestinationLocation(details?: HomeVisitsSingleVendorBookingDetails | null) {
  if (!details) {
    return null;
  }

  const directLocation = toLatLng(details);

  if (directLocation) {
    return directLocation;
  }

  const detailsRecord = asRecord(details);

  if (!detailsRecord) {
    return null;
  }

  const candidates: unknown[] = [
    detailsRecord.serviceCenterLocation,
    detailsRecord.deliveryDetails,
    detailsRecord.location,
    detailsRecord.addressLocation,
    detailsRecord.store,
  ];

  for (const candidate of candidates) {
    const point = toLatLng(candidate);

    if (point) {
      return point;
    }
  }

  const latitude = asNumber(detailsRecord.addressLatitude ?? detailsRecord.deliveryLatitude);
  const longitude = asNumber(detailsRecord.addressLongitude ?? detailsRecord.deliveryLongitude);

  if (latitude !== null && longitude !== null) {
    return { latitude, longitude };
  }

  return null;
}

export function extractWorkerLocation(details?: HomeVisitsSingleVendorBookingDetails | null) {
  if (!details) {
    return null;
  }

  const detailsRecord = asRecord(details);

  if (!detailsRecord) {
    return null;
  }

  const candidates: unknown[] = [
    detailsRecord.workerLocation,
    detailsRecord.currentLocation,
    detailsRecord.assignedWorker,
    asRecord(detailsRecord.assignedWorker)?.currentLocation,
  ];

  for (const candidate of candidates) {
    const point = toLatLng(candidate);

    if (point) {
      return point;
    }
  }

  return null;
}

export function isJobStatusUpdatedEvent(value: unknown): value is JobStatusUpdatedEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const payload = value as JobStatusUpdatedEvent;

  return (
    typeof payload.jobId === 'string'
    && payload.jobId.trim().length > 0
    && typeof payload.jobStatus === 'string'
    && payload.jobStatus.trim().length > 0
  );
}

export function isWorkerLocationEvent(value: unknown): value is WorkerLocationEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const payload = value as WorkerLocationEvent;

  return (
    typeof payload.latitude === 'number'
    && Number.isFinite(payload.latitude)
    && typeof payload.longitude === 'number'
    && Number.isFinite(payload.longitude)
  );
}
