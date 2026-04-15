import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../api/apiClient';
import { addressService } from '../api/addressService';

type PlacePrediction = {
  description: string;
  place_id: string;
};

export default function useAddressPredictions(input: string, isEnabled = true) {
  const normalizedInput = input.trim();

  return useQuery<PlacePrediction[], ApiError>({
    queryKey: ['addresses', 'predictions', normalizedInput],
    queryFn: () => addressService.searchPlaces(normalizedInput),
    enabled: isEnabled && normalizedInput.length > 0,
    staleTime: 60 * 1000,
  });
}
