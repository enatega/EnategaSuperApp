function readLabel(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const normalizedValue = value.trim();
    if (!normalizedValue) {
      continue;
    }

    const lowerCasedValue = normalizedValue.toLowerCase();
    if (
      lowerCasedValue === 'n/a'
      || lowerCasedValue === 'na'
      || lowerCasedValue === 'null'
      || lowerCasedValue === 'undefined'
    ) {
      continue;
    }

    return normalizedValue;
  }

  return undefined;
}

function readNestedRecord(value: unknown) {
  return value && typeof value === 'object'
    ? value as Record<string, unknown>
    : null;
}

export function resolvePickupLocationLabel(value: unknown) {
  const record = readNestedRecord(value);
  const courierDetail = readNestedRecord(record?.courierDetail ?? record?.courier_detail);

  return readLabel(
    record?.pickup_location,
    record?.pickupLocation,
    record?.pickup_address,
    record?.pickupAddress,
    courierDetail?.pickup_location,
    courierDetail?.pickup_address,
    courierDetail?.pickup_street_building,
  );
}

export function resolveDropoffLocationLabel(value: unknown) {
  const record = readNestedRecord(value);
  const courierDetail = readNestedRecord(record?.courierDetail ?? record?.courier_detail);
  const pickupLabel = resolvePickupLocationLabel(value);
  const primaryDropoffLabel = readLabel(
    record?.dropoff_location,
    record?.dropoffLocation,
  );
  const fallbackDropoffLabel = readLabel(
    record?.destination_address,
    record?.destinationAddress,
    courierDetail?.destination_address,
    courierDetail?.destination_street_building,
    courierDetail?.dropoff_location,
    courierDetail?.delivery_address,
    courierDetail?.delivery_street,
  );

  if (fallbackDropoffLabel && fallbackDropoffLabel !== pickupLabel) {
    return fallbackDropoffLabel;
  }

  if (primaryDropoffLabel) {
    return primaryDropoffLabel;
  }

  return fallbackDropoffLabel;
}
