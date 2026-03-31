export const SCHEDULE_ROW_HEIGHT = 36;
export const SCHEDULE_VISIBLE_ROWS = 5;
export const SCHEDULE_MIN_LEAD_MINUTES = 15;
export const SCHEDULE_MINUTE_INTERVAL = 5;
export const SCHEDULE_DAY_RANGE = 14;

export type ScheduleWheelOption<TValue extends string | number> = {
  label: string;
  value: TValue;
};

export type ScheduleWheelState = {
  dayIndex: number;
  hourIndex: number;
  minuteIndex: number;
  meridiemIndex: number;
};

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

const SCHEDULE_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

const SCHEDULE_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
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

export function getInitialScheduledDate(now: Date = new Date()) {
  const nextDate = new Date(now);
  nextDate.setMinutes(nextDate.getMinutes() + SCHEDULE_MIN_LEAD_MINUTES);
  return roundToNextInterval(nextDate, SCHEDULE_MINUTE_INTERVAL);
}

export function getScheduleDayOptions(now: Date = new Date()): ScheduleWheelOption<number>[] {
  return Array.from({ length: SCHEDULE_DAY_RANGE }, (_, index) => {
    const date = addDays(startOfDay(now), index);
    return {
      value: index,
      label: index === 0 ? 'Today' : DAY_LABEL_FORMATTER.format(date),
    };
  });
}

export function getScheduleHourOptions(): ScheduleWheelOption<number>[] {
  return Array.from({ length: 12 }, (_, index) => {
    const value = index + 1;
    return {
      value,
      label: String(value),
    };
  });
}

export function getScheduleMinuteOptions(): ScheduleWheelOption<number>[] {
  return Array.from({ length: 60 / SCHEDULE_MINUTE_INTERVAL }, (_, index) => {
    const value = index * SCHEDULE_MINUTE_INTERVAL;
    return {
      value,
      label: String(value).padStart(2, '0'),
    };
  });
}

export function getScheduleMeridiemOptions(): ScheduleWheelOption<'AM' | 'PM'>[] {
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

export function buildScheduledDate(params: {
  dayOffset: number;
  hour: number;
  minute: number;
  meridiem: 'AM' | 'PM';
  now?: Date;
}) {
  const baseDate = addDays(startOfDay(params.now ?? new Date()), params.dayOffset);
  return setTime(baseDate, to24Hour(params.hour, params.meridiem), params.minute);
}

export function isScheduledDateValid(date: Date, now: Date = new Date()) {
  return date.getTime() >= getInitialScheduledDate(now).getTime();
}

export function formatScheduledRideSummary(date: Date) {
  return `${SCHEDULE_DATE_FORMATTER.format(date)}. ${SCHEDULE_TIME_FORMATTER.format(date)}`;
}

export function toApiScheduledDateString(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export function getScheduleWheelState(
  date: Date,
  now: Date = new Date(),
): ScheduleWheelState {
  const startDate = startOfDay(now);
  const targetDate = startOfDay(date);
  const timeDifference = targetDate.getTime() - startDate.getTime();
  const dayIndex = Math.max(
    0,
    Math.min(SCHEDULE_DAY_RANGE - 1, Math.round(timeDifference / (1000 * 60 * 60 * 24))),
  );
  const hours24 = date.getHours();
  const hour12 = hours24 % 12 || 12;
  const meridiemIndex = hours24 >= 12 ? 1 : 0;
  const minuteIndex = Math.max(
    0,
    Math.min(
      (60 / SCHEDULE_MINUTE_INTERVAL) - 1,
      Math.round(date.getMinutes() / SCHEDULE_MINUTE_INTERVAL),
    ),
  );

  return {
    dayIndex,
    hourIndex: hour12 - 1,
    minuteIndex,
    meridiemIndex,
  };
}
