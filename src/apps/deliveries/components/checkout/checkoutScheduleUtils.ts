import type {
  CheckoutScheduleApiDay,
  CheckoutScheduleApiSlot,
  CheckoutScheduleSlotsResponse,
} from '../../api/orderServiceTypes';

export type CheckoutDeliveryTimeMode = 'standard' | 'schedule';
export type CheckoutScheduleDayKey = string;

export type CheckoutScheduleDayOption = {
  key: CheckoutScheduleDayKey;
  label: string;
  hasSlots: boolean;
  isActive: boolean;
};

export type CheckoutScheduleSlot = {
  id: string;
  isAvailable: boolean;
  label: string;
  scheduledAt: string;
};

function parseApiDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatScheduleDayLabel(
  day: CheckoutScheduleApiDay,
  labels: {
    today: string;
    tomorrow: string;
  },
) {
  const parsedDate = parseApiDate(day.date);

  if (!parsedDate) {
    return day.label;
  }

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(parsedDate);
  const normalizedLabel = day.label.trim().toLowerCase();

  if (normalizedLabel === 'today') {
    return `${labels.today}, ${dateLabel}`;
  }

  if (normalizedLabel === 'tomorrow') {
    return `${labels.tomorrow}, ${dateLabel}`;
  }

  return `${day.dayName}, ${dateLabel}`;
}

function formatScheduleSlotLabel(slot: CheckoutScheduleApiSlot) {
  return `${slot.start} - ${slot.end}`;
}

function buildScheduledAt(dateString: string, timeString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);

  if (!year || !month || !day || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return dateString;
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
}

export function isCheckoutScheduledAtInFuture(scheduledAt: string) {
  const parsedDate = new Date(scheduledAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate.getTime() > Date.now();
}

export function buildCheckoutScheduleDayOptions(
  response: CheckoutScheduleSlotsResponse | undefined,
  labels: {
    today: string;
    tomorrow: string;
  },
) {
  if (!response) {
    return [] satisfies CheckoutScheduleDayOption[];
  }

  return response.days.map((day) => ({
    key: day.date,
    label: formatScheduleDayLabel(day, labels),
    hasSlots: day.hasSlots,
    isActive: day.isActive,
  })) satisfies CheckoutScheduleDayOption[];
}

export function buildCheckoutScheduleSlots(
  response: CheckoutScheduleSlotsResponse | undefined,
  selectedDayKey: CheckoutScheduleDayKey,
) {
  if (!response) {
    return [] satisfies CheckoutScheduleSlot[];
  }

  const selectedDay = response.days.find((day) => day.date === selectedDayKey);
  const slotsSource = selectedDay?.slots ?? [];

  return slotsSource
    .filter((slot) => slot.isAvailable !== false)
    .map((slot, index) => ({
      id: `${selectedDayKey}-${slot.start}-${slot.end}-${index}`,
      isAvailable: slot.isAvailable !== false,
      label: formatScheduleSlotLabel(slot),
      scheduledAt: buildScheduledAt(selectedDayKey, slot.start),
    }))
    .filter((slot) => isCheckoutScheduledAtInFuture(slot.scheduledAt)) satisfies CheckoutScheduleSlot[];
}

export function findCheckoutScheduleDayKey(
  response: CheckoutScheduleSlotsResponse | undefined,
  scheduledAt?: string | null,
) {
  if (response?.days.length) {
    if (scheduledAt) {
      const parsedDate = new Date(scheduledAt);

      if (!Number.isNaN(parsedDate.getTime())) {
        const targetDate = formatDateKey(parsedDate);
        const matchedDay = response.days.find((day) => day.date === targetDate);

        if (matchedDay) {
          return matchedDay.date;
        }
      }
    }

    const activeDay = response.days.find((day) => day.isActive);

    return activeDay?.date ?? response.selectedDate ?? response.days[0].date;
  }

  if (!scheduledAt) {
    return null;
  }

  const parsedDate = new Date(scheduledAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return formatDateKey(parsedDate);
}

export function formatCheckoutScheduledAt(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
