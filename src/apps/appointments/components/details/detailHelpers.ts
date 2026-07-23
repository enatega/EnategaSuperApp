import type {
  AppointmentPublicTeamMember,
  AppointmentStoreService,
  AppointmentStoreTimingDay,
  AppointmentStoreTimingSlot,
  AppointmentStoreTimings,
} from '../../api/types';
import type { AdditionalInfoItem, OpeningDay, TeamMember } from './detailTypes';

const WEEK_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export function formatDistance(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return `${value.toFixed(1)} km`;
}

export function formatRating(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  return value.toFixed(1);
}

export function formatPrice(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return `$${value.toFixed(0)}`;
}

export function formatDurationMinutes(value?: number | null) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return null;
  }

  const hours = Math.floor(value / 60);
  const minutes = value % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hr, ${minutes} min`;
  }

  if (hours > 0) {
    return `${hours} hr`;
  }

  return `${minutes} min`;
}

function normalizeStoreTimingSlots(value: unknown): AppointmentStoreTimingSlot[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (slot): slot is AppointmentStoreTimingSlot =>
      typeof slot === 'object' &&
      slot !== null &&
      typeof (slot as AppointmentStoreTimingSlot).open === 'string' &&
      typeof (slot as AppointmentStoreTimingSlot).close === 'string',
  );
}

function normalizeStoreTimingDay(value: unknown): AppointmentStoreTimingDay {
  if (Array.isArray(value)) {
    const slots = normalizeStoreTimingSlots(value);
    return {
      is_active: slots.length > 0,
      slots,
    };
  }

  if (value && typeof value === 'object') {
    const dayValue = value as Partial<AppointmentStoreTimingDay>;
    const slots = normalizeStoreTimingSlots(dayValue.slots);
    return {
      is_active:
        typeof dayValue.is_active === 'boolean' ? dayValue.is_active : slots.length > 0,
      slots,
    };
  }

  return {
    is_active: false,
    slots: [],
  };
}

export function normalizeStoreTimings(
  storeTimings?: AppointmentStoreTimings | null,
): AppointmentStoreTimings | null {
  if (!storeTimings || typeof storeTimings !== 'object') {
    return null;
  }

  return Object.fromEntries(
    WEEK_DAYS.map((day) => [day, normalizeStoreTimingDay(storeTimings[day])]),
  ) as AppointmentStoreTimings;
}

export function getTodayStoreHours(storeTimings?: AppointmentStoreTimings | null) {
  const normalizedStoreTimings = normalizeStoreTimings(storeTimings);

  if (!normalizedStoreTimings) {
    return null;
  }

  const dayKey = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
    .format(new Date())
    .toLowerCase();
  const daySchedule = normalizedStoreTimings[dayKey];

  if (!daySchedule || !daySchedule.is_active || daySchedule.slots.length === 0) {
    return null;
  }

  const firstSlot = daySchedule.slots[0];

  if (!firstSlot?.open || !firstSlot?.close) {
    return null;
  }

  return `${firstSlot.open} - ${firstSlot.close}`;
}

export function isStoreClosed(store?: {
  isAvailable?: boolean;
  storeTimings?: AppointmentStoreTimings | null;
} | null) {
  if (!store) {
    return false;
  }

  if (store.isAvailable === false) {
    return true;
  }

  const dayKey = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
    .format(new Date())
    .toLowerCase();
  const daySchedule = normalizeStoreTimings(store.storeTimings)?.[dayKey];

  if (!daySchedule) {
    return false;
  }

  return !daySchedule.is_active || daySchedule.slots.length === 0;
}

function capitalizeLabel(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatOpeningDays(
  storeTimings?: AppointmentStoreTimings | null,
  closedLabel = 'Closed',
): OpeningDay[] {
  const normalizedStoreTimings = normalizeStoreTimings(storeTimings);

  if (!normalizedStoreTimings) {
    return [];
  }

  return WEEK_DAYS.map((day) => {
    const schedule = normalizedStoreTimings[day];
    const slot = schedule.slots[0];
    const value =
      schedule.is_active && slot?.open && slot?.close
        ? `${slot.open} - ${slot.close}`
        : closedLabel;

    return {
      day: capitalizeLabel(day),
      value,
      isActive: schedule.is_active,
    };
  });
}

export function getServiceMeta(
  item: AppointmentStoreService,
  fallbackLabel = '1 hr',
) {
  if (item.durationLabel?.trim()) {
    return item.durationLabel.trim();
  }

  if (
    typeof item.estimatedDurationMinutes === 'number' &&
    Number.isFinite(item.estimatedDurationMinutes) &&
    item.estimatedDurationMinutes > 0
  ) {
    return formatDurationMinutes(item.estimatedDurationMinutes) ?? fallbackLabel;
  }

  if (item.unitOfMeasure?.trim()) {
    return item.unitOfMeasure.trim();
  }

  if (item.shortDescription?.trim()) {
    return item.shortDescription.trim();
  }

  if (item.subcategory?.name) {
    return item.subcategory.name;
  }

  if (item.category?.name) {
    return item.category.name;
  }

  return fallbackLabel;
}

export function buildAdditionalInfoItems(
  storeView: {
    contact?: { phone?: string | null; email?: string | null } | null;
    isAvailable?: boolean;
  } | null | undefined,
  labels: {
    phone: string;
    email: string;
    booking: string;
    available: string;
  },
): AdditionalInfoItem[] {
  const items: AdditionalInfoItem[] = [];

  if (storeView?.contact?.phone) {
    items.push({
      id: 'phone',
      icon: 'call-outline',
      label: labels.phone,
    });
  }

  if (storeView?.contact?.email) {
    items.push({
      id: 'email',
      icon: 'mail-outline',
      label: labels.email,
    });
  }

  items.push({
    id: 'booking',
    icon: 'calendar-outline',
    label: labels.booking,
  });

  if (storeView?.isAvailable !== false) {
    items.push({
      id: 'available',
      icon: 'checkmark-circle-outline',
      label: labels.available,
    });
  }

  return items;
}

export function buildTeamMembers(
  workers: AppointmentPublicTeamMember[],
  roleFallback = 'Staff',
): TeamMember[] {
  const accentPalette = ['#E4C08D', '#D6D3F8', '#FDBA8C', '#FBCFE8'];

  return workers.map((worker, index) => ({
    id: worker.workerId,
    name: worker.name,
    role:
      worker.profession?.trim() ||
      worker.expertiseInService[0]?.trim() ||
      worker.secondarySkills[0]?.trim() ||
      roleFallback,
    rating: formatRating(worker.rating),
    accentColor: accentPalette[index % accentPalette.length] ?? '#E5E7EB',
    imageUrl: worker.profilePicture,
  }));
}
