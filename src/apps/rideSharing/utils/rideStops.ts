import type { CreateRidePayload, RideAddressSelection } from '../api/types';

export function toCreateRideStops(stops: RideAddressSelection[]): NonNullable<CreateRidePayload['stops']> {
  return stops.map((stop, index) => ({
    lat: stop.coordinates.latitude,
    lng: stop.coordinates.longitude,
    address: stop.description,
    order: index + 1,
  }));
}
