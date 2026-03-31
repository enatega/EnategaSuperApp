import { useQuery } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type { RideAddressSelection } from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

export default function useRideRoutePath(
  fromAddress: RideAddressSelection | undefined,
  toAddress: RideAddressSelection | undefined,
  stops: RideAddressSelection[] = [],
) {
  return useQuery<Array<{ latitude: number; longitude: number }>, ApiError>({
    queryKey: [
      ...rideKeys.route(
        fromAddress?.placeId ?? 'from',
        toAddress?.placeId ?? 'to',
      ),
      ...stops.map((stop) => stop.placeId),
    ],
    enabled: !!fromAddress && !!toAddress,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const orderedPoints = [fromAddress!, ...stops, toAddress!];
      const segmentPaths = await Promise.all(
        orderedPoints.slice(0, -1).map((point, index) =>
          rideService.getRoutePath(
            {
              lat: point.coordinates.latitude,
              lng: point.coordinates.longitude,
            },
            {
              lat: orderedPoints[index + 1].coordinates.latitude,
              lng: orderedPoints[index + 1].coordinates.longitude,
            },
          )),
      );

      return segmentPaths.flatMap((coordinates, index) => (
        index === 0 ? coordinates : coordinates.slice(1)
      ));
    },
  });
}
