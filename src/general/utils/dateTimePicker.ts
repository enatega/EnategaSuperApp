export const DATE_TIME_PICKER_ROW_HEIGHT = 36;
export const DATE_TIME_PICKER_VISIBLE_ROWS = 5;
export const DATE_TIME_PICKER_DEFAULT_MIN_LEAD_MINUTES = 15;
export const DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL = 5;
export const DATE_TIME_PICKER_DEFAULT_DAY_RANGE = 14;

export type DateTimePickerOption<TValue extends string | number> = {
  label: string;
  value: TValue;
};

export type DateTimePickerWheelState = {
  dayIndex: number;
  hourIndex: number;
  minuteIndex: number;
  meridiemIndex: number;
};

const DEFAULT_DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

function setTime(date: Date, hour: number, minute: number) {
  const nextDate = new Date(date);
  nextDate.setHours(hour, minute, 0, 0);
  return nextDate;
}

function startOfDay(date: Date) {
  return setTime(date, 0, 0);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function roundToNextInterval(date: Date, intervalMinutes: number) {
  const nextDate = new Date(date);
  nextDate.setSeconds(0, 0);
  const remainder = nextDate.getMinutes() % intervalMinutes;

  if (remainder !== 0) {
    nextDate.setMinutes(nextDate.getMinutes() + (intervalMinutes - remainder));
  }

  return nextDate;
}

export function getInitialDateTimePickerDate(params?: {
  now?: Date;
  minLeadMinutes?: number;
  minuteInterval?: number;
}) {
  const now = params?.now ?? new Date();
  const minLeadMinutes = params?.minLeadMinutes ?? DATE_TIME_PICKER_DEFAULT_MIN_LEAD_MINUTES;
  const minuteInterval = params?.minuteInterval ?? DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL;
  const nextDate = new Date(now);
  nextDate.setMinutes(nextDate.getMinutes() + minLeadMinutes);
  return roundToNextInterval(nextDate, minuteInterval);
}

export function getDateTimePickerDayOptions(params?: {
  now?: Date;
  dayRange?: number;
  todayLabel?: string;
}): DateTimePickerOption<number>[] {
  const now = params?.now ?? new Date();
  const dayRange = params?.dayRange ?? DATE_TIME_PICKER_DEFAULT_DAY_RANGE;
  const todayLabel = params?.todayLabel ?? 'Today';

  return Array.from({ length: dayRange }, (_, index) => {
    const date = addDays(startOfDay(now), index);
    return {
      value: index,
      label: index === 0 ? todayLabel : DEFAULT_DAY_LABEL_FORMATTER.format(date),
    };
  });
}

export function getDateTimePickerHourOptions(): DateTimePickerOption<number>[] {
  return Array.from({ length: 12 }, (_, index) => {
    const value = index + 1;
    return {
      value,
      label: String(value),
    };
  });
}

export function getDateTimePickerMinuteOptions(
  minuteInterval: number = DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL,
): DateTimePickerOption<number>[] {
  return Array.from({ length: 60 / minuteInterval }, (_, index) => {
    const value = index * minuteInterval;
    return {
      value,
      label: String(value).padStart(2, '0'),
    };
  });
}

export function getDateTimePickerMeridiemOptions(): DateTimePickerOption<'AM' | 'PM'>[] {
  return [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ];
}

export function to24Hour(hour: number, meridiem: 'AM' | 'PM') {
  if (meridiem === 'AM') {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
}

export function buildDateTimePickerDate(params: {
  dayOffset: number;
  hour: number;
  minute: number;
  meridiem: 'AM' | 'PM';
  now?: Date;
}) {
  const baseDate = addDays(startOfDay(params.now ?? new Date()), params.dayOffset);
  return setTime(baseDate, to24Hour(params.hour, params.meridiem), params.minute);
}

export function isDateTimePickerDateValid(
  date: Date,
  params?: {
    now?: Date;
    minLeadMinutes?: number;
    minuteInterval?: number;
  },
) {
  const now = params?.now ?? new Date();
  const minLeadMinutes = params?.minLeadMinutes ?? DATE_TIME_PICKER_DEFAULT_MIN_LEAD_MINUTES;
  const minuteInterval = params?.minuteInterval ?? DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL;
  return date.getTime() >= getInitialDateTimePickerDate({
    now,
    minLeadMinutes,
    minuteInterval,
  }).getTime();
}

export function getDateTimePickerWheelState(
  date: Date,
  params?: {
    now?: Date;
    dayRange?: number;
    minuteInterval?: number;
  },
): DateTimePickerWheelState {
  const now = params?.now ?? new Date();
  const dayRange = params?.dayRange ?? DATE_TIME_PICKER_DEFAULT_DAY_RANGE;
  const minuteInterval = params?.minuteInterval ?? DATE_TIME_PICKER_DEFAULT_MINUTE_INTERVAL;
  const startDate = startOfDay(now);
  const targetDate = startOfDay(date);
  const timeDifference = targetDate.getTime() - startDate.getTime();
  const dayIndex = Math.max(
    0,
    Math.min(dayRange - 1, Math.round(timeDifference / (1000 * 60 * 60 * 24))),
  );
  const hours24 = date.getHours();
  const hour12 = hours24 % 12 || 12;
  const meridiemIndex = hours24 >= 12 ? 1 : 0;
  const minuteIndex = Math.max(
    0,
    Math.min((60 / minuteInterval) - 1, Math.round(date.getMinutes() / minuteInterval)),
  );

  return {
    dayIndex,
    hourIndex: hour12 - 1,
    minuteIndex,
    meridiemIndex,
  };
}
