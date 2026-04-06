export type CheckoutDeliveryTimeMode = 'standard' | 'schedule';
export type CheckoutScheduleDayKey = 'today' | 'tomorrow';

export type CheckoutScheduleDayOption = {
  key: CheckoutScheduleDayKey;
  label: string;
};

export type CheckoutScheduleSlot = {
  id: string;
  label: string;
  scheduledAt: string;
};

const TODAY_SLOT_START_HOURS = [17, 18, 19, 20, 21];
const TOMORROW_SLOT_START_HOURS = [8, 9, 10, 11, 12, 13];

function buildDateAtHour(baseDate: Date, dayOffset: number, hour: number) {
  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate() + dayOffset,
    hour,
    0,
    0,
    0,
  );
}

function formatSlotLabel(startHour: number) {
  const startLabel = String(startHour).padStart(2, '0');
  const endLabel = String(startHour + 1).padStart(2, '0');

  return `${startLabel}:00 - ${endLabel}:00`;
}

function formatTabDateLabel(
  date: Date,
  prefix: string,
) {
  const dateLabel = new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
  }).format(date);

  return `${prefix}, ${dateLabel}`;
}

export function buildCheckoutScheduleDayOptions(labels: {
  today: string;
  tomorrow: string;
}) {
  const now = new Date();
  const today = new Date(now);
  const tomorrow = new Date(now);

  tomorrow.setDate(now.getDate() + 1);

  return [
    {
      key: 'today',
      label: formatTabDateLabel(today, labels.today),
    },
    {
      key: 'tomorrow',
      label: formatTabDateLabel(tomorrow, labels.tomorrow),
    },
  ] satisfies CheckoutScheduleDayOption[];
}

export function buildCheckoutScheduleSlots(
  dayKey: CheckoutScheduleDayKey,
  labels: { asap: string },
) {
  const now = new Date();
  const slots: CheckoutScheduleSlot[] = [];

  if (dayKey === 'today') {
    const asapDate = new Date(now.getTime() + (30 * 60 * 1000));

    slots.push({
      id: 'today-asap',
      label: labels.asap,
      scheduledAt: asapDate.toISOString(),
    });
  }

  const startHours = dayKey === 'today'
    ? TODAY_SLOT_START_HOURS
    : TOMORROW_SLOT_START_HOURS;
  const dayOffset = dayKey === 'today' ? 0 : 1;

  for (const startHour of startHours) {
    const startDate = buildDateAtHour(now, dayOffset, startHour);

    if (startDate.getTime() <= now.getTime()) {
      continue;
    }

    slots.push({
      id: `${dayKey}-${startHour}`,
      label: formatSlotLabel(startHour),
      scheduledAt: startDate.toISOString(),
    });
  }

  return slots;
}

export function findCheckoutScheduleDayKey(
  scheduledAt?: string | null,
) {
  if (!scheduledAt) {
    return 'today' as const;
  }

  const parsedDate = new Date(scheduledAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'today' as const;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
  const diffInDays = Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));

  return diffInDays >= 1 ? 'tomorrow' : 'today';
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
