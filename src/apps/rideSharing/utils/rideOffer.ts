import type { RideIntent } from './rideOptions';

export type RideOfferMode = 'standard' | 'hourly';

export const DEFAULT_HOURLY_HOURS = 2;
export const MIN_HOURLY_HOURS = 1;
export const HOURLY_INCLUDED_MILES_PER_HOUR = 20;

export function resolveRideOfferMode(
  rideType?: RideIntent,
  offerMode?: RideOfferMode,
): RideOfferMode {
  if (offerMode) {
    return offerMode;
  }

  return rideType === 'rental' ? 'hourly' : 'standard';
}

export function getHourlyIncludedMiles(hours: number) {
  return Math.max(hours, MIN_HOURLY_HOURS) * HOURLY_INCLUDED_MILES_PER_HOUR;
}

export function getRecommendedOfferFare(params: {
  baseFare?: number;
  offerMode: RideOfferMode;
  hourlyHours: number;
}) {
  const resolvedBaseFare = typeof params.baseFare === 'number' ? params.baseFare : 0;

  if (params.offerMode === 'hourly') {
    return resolvedBaseFare * Math.max(params.hourlyHours, MIN_HOURLY_HOURS);
  }

  return resolvedBaseFare;
}

export function getSuggestedOfferFare(params: {
  recommendedFare: number;
  offerMode: RideOfferMode;
}) {
  if (params.offerMode === 'hourly') {
    return params.recommendedFare * 1.05;
  }

  return params.recommendedFare;
}
