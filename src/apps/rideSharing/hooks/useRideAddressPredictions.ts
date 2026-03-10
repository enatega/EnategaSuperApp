import { useQuery } from '@tanstack/react-query';
import { rideKeys } from '../api/queryKeys';
import { rideService } from '../api/rideService';
import type { RidePlacePrediction } from '../api/types';
import { ApiError } from '../../../general/api/apiClient';

export default function useRideAddressPredictions(input: string, enabled = true) {
  const normalizedInput = input.trim();

  return useQuery<RidePlacePrediction[], ApiError>({
    queryKey: rideKeys.placeSuggestions(normalizedInput),
    queryFn: () => rideService.searchPlaces(normalizedInput),
    enabled: enabled && normalizedInput.length > 0,
    staleTime: 60 * 1000,
  });
}
