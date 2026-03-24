import type { RideAddressSelection } from '../api/types';
import type { ActiveRideViewData } from '../screens/activeRide/types/view';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function readDisplayString(...values: unknown[]) {
  const resolvedValue = readString(...values);
  if (!resolvedValue) {
    return undefined;
  }

  const normalizedValue = resolvedValue.trim().toLowerCase();
  if (normalizedValue === 'n/a' || normalizedValue === 'na' || normalizedValue === 'null' || normalizedValue === 'undefined') {
    return undefined;
  }

  return resolvedValue;
}

function readNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsedValue = Number.parseFloat(value);
      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return undefined;
}

function createAddressSelection(
  rideId: string,
  kind: 'pickup' | 'dropoff',
  label: string,
  coordinates: { latitude: number; longitude: number },
): RideAddressSelection {
  return {
    placeId: `${rideId}:${kind}`,
    description: label,
    structuredFormatting: {
      mainText: label,
    },
    coordinates,
  };
}

function readCoordinates(value: unknown) {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }

  const latitude = readNumber(record.latitude, record.lat);
  const longitude = readNumber(record.longitude, record.lng, record.lon);

  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }

  return { latitude, longitude };
}

function formatStatusLabel(status: string) {
  return status
    .trim()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getActiveRideTitle(status: string, estimatedTime?: number) {
  if (typeof estimatedTime === 'number' && Number.isFinite(estimatedTime) && estimatedTime > 0) {
    const roundedEta = Math.max(1, Math.round(estimatedTime));
    return `Arriving in ${roundedEta} min${roundedEta === 1 ? '' : 's'}`;
  }

  switch (status.trim().toUpperCase()) {
    case 'ASSIGNED':
      return 'Arriving soon';
    case 'IN_PROGRESS':
      return 'On your trip';
    case 'COMPLETED':
      return 'Trip completed';
    default:
      return 'Active ride';
  }
}

function formatPaymentMethod(paymentMethod: string | undefined) {
  if (!paymentMethod) {
    return undefined;
  }

  return paymentMethod
    .trim()
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function mapActiveRideToViewData(activeRide: unknown): ActiveRideViewData | null {
  const rootRecord = asRecord(activeRide);
  const rideRecord = rootRecord ? asRecord(rootRecord.rideReq) ?? rootRecord : null;

  if (!rideRecord) {
    return null;
  }

  const rideId = readString(
    rideRecord.id,
    rideRecord.ride_id,
    rootRecord?.id,
    rootRecord?.ride_id,
  );
  const pickupRecord = asRecord(rideRecord.pickup);
  const dropoffRecord = asRecord(rideRecord.dropoff);
  const pickupLabel = readString(
    pickupRecord?.location,
    pickupRecord?.address,
    rideRecord.pickup_location,
    rideRecord.pickup_address,
  );
  const dropoffLabel = readString(
    dropoffRecord?.location,
    dropoffRecord?.address,
    rideRecord.dropoff_location,
    rideRecord.destination_address,
    rideRecord.dropoff_address,
  );
  const pickupCoordinates = readCoordinates(pickupRecord);
  const dropoffCoordinates = readCoordinates(dropoffRecord);
  const status = readString(rideRecord.ride_status, rideRecord.status);

  if (!rideId || !pickupLabel || !dropoffLabel || !pickupCoordinates || !dropoffCoordinates || !status) {
    return null;
  }

  const driverRecord = asRecord(rideRecord.driver) ?? asRecord(rootRecord?.driver) ?? asRecord(rootRecord?.riderInfo);
  const driverUserRecord = asRecord(driverRecord?.user);
  const driverDynamicInfoRecord = asRecord(driverRecord?.dynamic_info);
  const vehicleRecord = asRecord(rideRecord.vehicle) ?? asRecord(rootRecord?.vehicle) ?? asRecord(driverRecord?.vehicle);
  const estimatedTime = readNumber(rideRecord.estimated_time, rideRecord.estimatedTime);
  const vehicleName = readDisplayString(
    vehicleRecord?.vehicle_name,
    vehicleRecord?.vehicleName,
    vehicleRecord?.name,
    vehicleRecord?.model,
    rideRecord.vehicle_name,
  );
  const vehicleColor = readDisplayString(
    vehicleRecord?.vehicle_colour,
    vehicleRecord?.vehicleColor,
    vehicleRecord?.colour,
    vehicleRecord?.color,
  );
  const licensePlate = readDisplayString(
    vehicleRecord?.vehicle_no,
    vehicleRecord?.vehicleNo,
    vehicleRecord?.licensePlate,
    vehicleRecord?.no,
  );

  return {
    rideId,
    fromAddress: createAddressSelection(rideId, 'pickup', pickupLabel, pickupCoordinates),
    toAddress: createAddressSelection(rideId, 'dropoff', dropoffLabel, dropoffCoordinates),
    title: getActiveRideTitle(status, estimatedTime),
    statusLabel: formatStatusLabel(status),
    fare: readNumber(rideRecord.fare, rideRecord.agreedPrice, rideRecord.agreed_price, rideRecord.offeredFair),
    paymentMethodLabel: formatPaymentMethod(readString(rideRecord.payment_via, rideRecord.paymentVia)),
    driverName: readDisplayString(driverUserRecord?.name, driverRecord?.name),
    driverRating: readNumber(
      driverDynamicInfoRecord?.averageRating,
      driverRecord?.rating,
      driverRecord?.averageRating,
      driverRecord?.average_rating,
    ),
    driverAvatarUri: readString(driverUserRecord?.profile, driverRecord?.profile),
    driverPhone: readString(driverUserRecord?.phone, driverRecord?.phone),
    vehicleName,
    vehicleColor,
    licensePlate,
    driverCoordinate: readCoordinates(driverUserRecord?.current_location),
  };
}
