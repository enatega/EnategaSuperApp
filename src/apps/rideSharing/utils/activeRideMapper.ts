import type {
  ActiveRidePayload,
} from '../api/types';
import type { CompletedRideFeedbackData } from '../screens/activeRide/types/view';

const ACTIVE_RIDE_SEGMENT_COLORS = [
  '#0F8EC7',
  '#8B5CF6',
  '#F59E0B',
  '#EC4899',
  '#14B8A6',
] as const;

function readString(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function readDisplayString(...values: Array<unknown>) {
  const resolvedValue = readString(...values);
  if (!resolvedValue) {
    return undefined;
  }

  const normalizedValue = resolvedValue.toLowerCase();
  if (
    normalizedValue === 'n/a'
    || normalizedValue === 'na'
    || normalizedValue === 'null'
    || normalizedValue === 'undefined'
  ) {
    return undefined;
  }

  return resolvedValue;
}

export function getActiveRideDriverUserId(activeRide: ActiveRidePayload | null | undefined) {
  const driver = activeRide?.driver;

  return readString(
    driver?.user?.id,
    driver?.id,
  );
}

export function isRideInProgressStatus(statusCode?: string) {
  return statusCode === 'IN_PROGRESS' || statusCode === 'DRIVER_REACHED';
}

export function getActiveRideDriverPolylineColor(statusCode?: string) {
  return isRideInProgressStatus(statusCode) ? '#16A34A' : '#22C55E';
}

export function getActiveRideTripSegmentColor(index: number) {
  return ACTIVE_RIDE_SEGMENT_COLORS[index % ACTIVE_RIDE_SEGMENT_COLORS.length];
}

export function mapActiveRideToCompletedRideFeedbackData(
  activeRide: ActiveRidePayload | null | undefined,
): CompletedRideFeedbackData | null {
  const rideId = readString(
    activeRide?.ride_id,
  );
  const driver = activeRide?.driver;

  if (!rideId || !activeRide) {
    return null;
  }

  return {
    rideId,
    driverUserId: getActiveRideDriverUserId(activeRide),
    driverName: readDisplayString(driver?.user?.name),
    driverAvatarUri: readString(driver?.user?.profile),
    rawRideData: activeRide,
  };
}
