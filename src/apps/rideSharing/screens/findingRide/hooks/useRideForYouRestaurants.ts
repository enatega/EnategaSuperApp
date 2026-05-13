import { useQuery } from '@tanstack/react-query';
import apiClient, { ApiError } from '../../../../../general/api/apiClient';
import type { RideForYouRestaurant } from '../types/forYou';

type RecommendedStoresApiResponse =
  | RideForYouRestaurant[]
  | {
      data?: RideForYouRestaurant[] | { items?: RideForYouRestaurant[] };
      items?: RideForYouRestaurant[];
      rows?: RideForYouRestaurant[];
    };

function toRecommendedStores(response: RecommendedStoresApiResponse | undefined): RideForYouRestaurant[] {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.items)) {
    return response.items;
  }

  if (Array.isArray(response.rows)) {
    return response.rows;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (Array.isArray(response.data?.items)) {
    return response.data.items;
  }

  return [];
}

export function useRideForYouRestaurants() {
  return useQuery<RideForYouRestaurant[], ApiError>({
    queryKey: ['rideSharing', 'findingRide', 'forYouRestaurants'],
    queryFn: async () => {
      const response = await apiClient.get<RecommendedStoresApiResponse>(
        '/api/v1/apps/deliveries/discovery/public/recommended-stores',
        {
          offset: 0,
          limit: 10,
          sort_by: 'recommended',
        },
        { skipAuth: true },
      );

      return toRecommendedStores(response);
    },
    staleTime: 5 * 60 * 1000,
  });
}

