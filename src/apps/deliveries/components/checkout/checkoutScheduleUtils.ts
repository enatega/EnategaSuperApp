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

function parseScheduleTime(timeString: string) {
  const normalizedValue = timeString.trim().toLowerCase();
  const match = normalizedValue.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/i);

  if (!match) {
    return null;
  }

  const rawHours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];

  if (Number.isNaN(rawHours) || Number.isNaN(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  let hours = rawHours;

  if (meridiem) {
    if (hours < 1 || hours > 12) {
      return null;
    }

    if (meridiem === 'pm' && hours < 12) {
      hours += 12;
    }

    if (meridiem === 'am' && hours === 12) {
      hours = 0;
    }
  } else if (hours < 0 || hours > 23) {
    return null;
  }

  return { hours, minutes };
}

function buildScheduledAt(dateString: string, timeString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const parsedTime = parseScheduleTime(timeString);
  const hours = parsedTime?.hours;
  const minutes = parsedTime?.minutes;

  if (!year || !month || !day || typeof hours !== 'number' || typeof minutes !== 'number') {
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

  return response.days.map((day) => {
    const hasFutureSlots = day.slots
      .filter((slot) => slot.isAvailable !== false)
      .some((slot) => isCheckoutScheduledAtInFuture(buildScheduledAt(day.date, slot.start)));

    return {
      key: day.date,
      label: formatScheduleDayLabel(day, labels),
      // Some backends may not hydrate `day.slots` for every day consistently.
      // Keep API `hasSlots` as a fallback so tabs remain selectable.
      hasSlots: day.hasSlots || hasFutureSlots,
      isActive: day.isActive,
    };
  }) satisfies CheckoutScheduleDayOption[];
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
