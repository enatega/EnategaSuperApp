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
) {
  return useQuery<RideEstimateOptionsResult, ApiError>({
    queryKey: [
      ...rideKeys.estimates(),
      fromAddress?.placeId,
      toAddress?.placeId,
    ],
    enabled: !!fromAddress && !!toAddress,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const origins = [
        `${fromAddress!.coordinates.latitude},${fromAddress!.coordinates.longitude}`,
      ];
      const destinations = [
        `${toAddress!.coordinates.latitude},${toAddress!.coordinates.longitude}`,
      ];

      const distanceMatrix = await rideService.getDistanceMatrix(origins, destinations);
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
