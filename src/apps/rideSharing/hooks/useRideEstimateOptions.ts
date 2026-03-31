import { useQuery } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type { RideAddressSelection, RideTypeFare } from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

type RideEstimateOptionsResult = {
  distanceKm: number;
  durationMin: number;
  rideTypeFares: RideTypeFare[];
};

export default function useRideEstimateOptions(
  fromAddress: RideAddressSelection | undefined,
  toAddress: RideAddressSelection | undefined,
  stops: RideAddressSelection[] = [],
) {
  return useQuery<RideEstimateOptionsResult, ApiError>({
    queryKey: [
      ...rideKeys.estimates(),
      fromAddress?.placeId,
      ...stops.map((stop) => stop.placeId),
      toAddress?.placeId,
    ],
    enabled: !!fromAddress && !!toAddress,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const orderedPoints = [fromAddress!, ...stops, toAddress!];
      const tripSegments = orderedPoints.slice(0, -1).map((point, index) => ({
        origin: point,
        destination: orderedPoints[index + 1],
      }));
      const segmentDistanceMatrices = await Promise.all(
        tripSegments.map((segment) =>
          rideService.getDistanceMatrix(
            [`${segment.origin.coordinates.latitude},${segment.origin.coordinates.longitude}`],
            [`${segment.destination.coordinates.latitude},${segment.destination.coordinates.longitude}`],
          ),
        ),
      );
      const distanceMatrix = segmentDistanceMatrices.reduce(
        (totals, segment) => ({
          distanceKm: totals.distanceKm + segment.distanceKm,
          durationMin: totals.durationMin + segment.durationMin,
        }),
        { distanceKm: 0, durationMin: 0 },
      );
      const rideTypeFares = await rideService.getRideTypeFares({
        distanceKm: distanceMatrix.distanceKm,
        durationMin: distanceMatrix.durationMin,
        isHourly: false,
        pickup_lat: fromAddress!.coordinates.latitude,
        pickup_lng: fromAddress!.coordinates.longitude,
        dropoff_lat: toAddress!.coordinates.latitude,
        dropoff_lng: toAddress!.coordinates.longitude,
      });

      return {
        distanceKm: distanceMatrix.distanceKm,
        durationMin: distanceMatrix.durationMin,
        rideTypeFares,
      };
    },
  });
}
