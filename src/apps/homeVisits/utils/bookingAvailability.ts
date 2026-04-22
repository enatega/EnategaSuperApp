import type {
  HomeVisitsSingleVendorBookingAvailabilityRangeResponse,
  HomeVisitsSingleVendorBookingAvailabilityResponse,
  HomeVisitsSingleVendorBookingAvailabilitySlot,
} from '../singleVendor/api/types';

export function formatBookingDateOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toMinutesFromStartOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function parseTimeToMinutes(value: string) {
  const [hourRaw, minuteRaw] = value.split(':');
  const hours = Number(hourRaw);
  const minutes = Number(minuteRaw);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return (hours * 60) + minutes;
}

function isSlotMatchingSelection(
  slot: HomeVisitsSingleVendorBookingAvailabilitySlot,
  selectedMinutes: number,
) {
  const openMinutes = parseTimeToMinutes(slot.open);
  const closeMinutes = parseTimeToMinutes(slot.close);

  if (openMinutes == null || closeMinutes == null) {
    return false;
  }

  return selectedMinutes >= openMinutes && selectedMinutes < closeMinutes;
}

function hasWorkerSlotAtSelectedTime(
  workers: HomeVisitsSingleVendorBookingAvailabilityResponse['workers'],
  selectedMinutes: number,
  teamSize: number,
) {
  let availableCount = 0;

  for (const worker of workers ?? []) {
    const hasMatchingSlot = worker.slots.some((slot) => {
      const openMinutes = parseTimeToMinutes(slot.open);
      const closeMinutes = parseTimeToMinutes(slot.close);

      if (openMinutes == null || closeMinutes == null) {
        return false;
      }

      return selectedMinutes >= openMinutes && selectedMinutes < closeMinutes;
    });

    if (hasMatchingSlot) {
      availableCount += 1;
    }

    if (availableCount >= teamSize) {
      return true;
    }
  }

  return false;
}

export function isBookingTimeAvailable(
  response: HomeVisitsSingleVendorBookingAvailabilityResponse,
  selectedDate: Date,
  teamSize: number,
) {
  const selectedMinutes = toMinutesFromStartOfDay(selectedDate);
  const matchingSlot = response.slots.find(
    (slot) => slot.meetsTeamSize && isSlotMatchingSelection(slot, selectedMinutes),
  );

  if (matchingSlot) {
    return true;
  }

  if (response.slots.length > 0) {
    return false;
  }

  return hasWorkerSlotAtSelectedTime(response.workers ?? [], selectedMinutes, teamSize);
}

function isSlotAvailableForTeam(
  slot: HomeVisitsSingleVendorBookingAvailabilitySlot,
  selectedMinutes: number,
  teamSize: number,
) {
  if (!isSlotMatchingSelection(slot, selectedMinutes)) {
    return false;
  }

  if (slot.meetsTeamSize === false) {
    return false;
  }

  if (
    typeof slot.availableWorkers === 'number' &&
    Number.isFinite(slot.availableWorkers) &&
    slot.availableWorkers < teamSize
  ) {
    return false;
  }

  return true;
}

export function isBookingTimeRangeAvailable(
  response: HomeVisitsSingleVendorBookingAvailabilityRangeResponse,
  selectedDate: Date,
  teamSize: number,
  days: number,
) {
  if (!response.scheduleAllowed || !response.serviceCenterAvailable) {
    return false;
  }

  if (response.dailyAvailability.length < days) {
    return false;
  }

  const selectedMinutes = toMinutesFromStartOfDay(selectedDate);

  return response.dailyAvailability.every((dayAvailability) => {
    if (!dayAvailability.scheduleAllowed || !dayAvailability.serviceCenterAvailable) {
      return false;
    }

    if (dayAvailability.slots.length > 0) {
      return dayAvailability.slots.some((slot) =>
        isSlotAvailableForTeam(slot, selectedMinutes, teamSize),
      );
    }

    return hasWorkerSlotAtSelectedTime(
      dayAvailability.workers ?? [],
      selectedMinutes,
      teamSize,
    );
  });
}
