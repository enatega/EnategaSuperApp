import type { FindingRideBid } from '../screens/findingRide/types/bids';

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as UnknownRecord
    : null;
}

function readString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function readNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number(value);
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function readRideRequestId(value: unknown) {
  const payload = asRecord(value);
  const nestedRideRequest = asRecord(payload?.rideRequest);

  return readString(
    payload?.rideRequestId,
    payload?.ride_request_id,
    payload?.rideId,
    payload?.ride_id,
    nestedRideRequest?.id,
  );
}

export function normalizeRideBidEvent(value: unknown): {
  rideRequestId?: string;
  bid: FindingRideBid;
} | null {
  const payload = asRecord(value);
  if (!payload) {
    return null;
  }

  const rider = asRecord(payload.rider);
  const riderProfile = asRecord(rider?.userProfile);
  const riderUser = asRecord(riderProfile?.user);
  const stats = asRecord(payload.stats);
  const rideRequest = asRecord(payload.rideRequest);
  const rideType = asRecord(rideRequest?.ride_type);

  const id = readString(payload.id, payload.bidId, payload.bid_id);
  const amount = readNumber(
    payload.amount,
    payload.price,
    payload.bidAmount,
    payload.bid_amount,
    payload.fare,
  );

  if (!id || typeof amount !== 'number') {
    return null;
  }

  const driverName = readString(
    payload.driverName,
    payload.driver_name,
    riderUser?.name,
    payload.name,
  ) ?? 'Driver';

  return {
    rideRequestId: readRideRequestId(payload),
    bid: {
      id,
      driverName,
      driverAvatarUri: readString(
        payload.driverAvatarUri,
        payload.driver_avatar_uri,
        riderUser?.profile,
        riderUser?.avatar,
      ),
      driverRides: readNumber(
        payload.driverRides,
        payload.driver_rides,
        stats?.totalRides,
        stats?.total_rides,
      ),
      vehicleLabel: readString(
        payload.vehicleLabel,
        payload.vehicle_label,
        rideType?.name,
        payload.vehicleName,
      ),
      etaMin: readNumber(
        payload.etaMin,
        payload.eta_min,
        payload.estimatedTime,
        payload.estimated_time,
      ),
      distanceKm: readNumber(
        payload.distanceKm,
        payload.distance_km,
        payload.distance,
      ),
      rating: readNumber(
        payload.rating,
        payload.driverRating,
        payload.driver_rating,
        stats?.averageRating,
        stats?.average_rating,
      ),
      amount,
    },
  };
}
