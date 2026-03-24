import type { ActiveRideRequestPayload, RideAddressSelection } from '../api/types';
import type { RideOptionItem } from '../components/rideOptions/types';
import type { FindingRideViewData } from '../screens/findingRide/types/view';

function toAddressSelection(
  requestId: string,
  kind: 'pickup' | 'dropoff',
  description: string,
  coordinates: { lat: number; lng: number },
): RideAddressSelection {
  return {
    placeId: `${requestId}:${kind}`,
    description,
    structuredFormatting: {
      mainText: description,
    },
    coordinates: {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    },
  };
}

function toCurrencyNumber(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number.parseFloat(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

export function mapActiveRideRequestToFindingRideViewData(
  activeRideRequest: ActiveRideRequestPayload,
): FindingRideViewData {
  return {
    rideRequestId: activeRideRequest.id,
    fromAddress: toAddressSelection(
      activeRideRequest.id,
      'pickup',
      activeRideRequest.pickup_location,
      activeRideRequest.pickup,
    ),
    toAddress: toAddressSelection(
      activeRideRequest.id,
      'dropoff',
      activeRideRequest.dropoff_location,
      activeRideRequest.dropoff,
    ),
    selectedRide: {
      id: activeRideRequest.ride_type_id as RideOptionItem['id'],
      title: activeRideRequest.ride_type?.name ?? 'Ride',
      icon: activeRideRequest.ride_type?.imageUrl ?? undefined,
      seats: activeRideRequest.ride_type?.seatCount,
    },
    offeredFare: toCurrencyNumber(activeRideRequest.offeredFair),
    recommendedFare: toCurrencyNumber(activeRideRequest.baseFair),
  };
}
