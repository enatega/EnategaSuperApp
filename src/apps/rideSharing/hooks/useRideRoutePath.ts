import { useQuery } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type { RideAddressSelection } from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

export default function useRideRoutePath(
  fromAddress: RideAddressSelection | undefined,
  toAddress: RideAddressSelection | undefined,
) {
  return useQuery<Array<{ latitude: number; longitude: number }>, ApiError>({
    queryKey: rideKeys.route(
      fromAddress?.placeId ?? 'from',
      toAddress?.placeId ?? 'to',
    ),
    enabled: !!fromAddress && !!toAddress,
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      rideService.getRoutePath(
        {
          lat: fromAddress!.coordinates.latitude,
          lng: fromAddress!.coordinates.longitude,
        },
        {
          lat: toAddress!.coordinates.latitude,
          lng: toAddress!.coordinates.longitude,
        },
      ),
  });
}
