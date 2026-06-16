import type { DeliveryStoreTimings } from '../api/types';

type StoreAvailabilityInput = {
  isOpen?: boolean | null;
  storeTimings?: DeliveryStoreTimings | null;
};

function getTodayStoreSchedule(storeTimings?: DeliveryStoreTimings | null) {
  if (!storeTimings) {
    return null;
  }

  const dayKey = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
    .format(new Date())
    .toLowerCase();

  return storeTimings[dayKey] ?? null;
}

export function getTodayStoreHours(
  storeTimings?: DeliveryStoreTimings | null,
  fallback?: string,
) {
  const daySchedule = getTodayStoreSchedule(storeTimings);

  if (!daySchedule) {
    return fallback ?? null;
  }

  if (!daySchedule.is_active || daySchedule.slots.length === 0) {
    return fallback ?? null;
  }

  const firstSlot = daySchedule.slots[0];

  if (!firstSlot?.open || !firstSlot?.close) {
    return fallback ?? null;
  }

  return `${firstSlot.open} - ${firstSlot.close}`;
}

export function isStoreEffectivelyClosed({
  isOpen,
  storeTimings,
}: StoreAvailabilityInput) {
  if (isOpen === false) {
    return true;
  }

  const daySchedule = getTodayStoreSchedule(storeTimings);

  if (!daySchedule) {
    return true;
  }

  if (!daySchedule.is_active || daySchedule.slots.length === 0) {
    return true;
  }

  return !daySchedule.slots.some((slot) => Boolean(slot?.open && slot?.close));
}
