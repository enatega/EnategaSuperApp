import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import type {
  AppointmentFavouriteStoresResponse,
  ToggleAppointmentFavouriteParams,
  ToggleAppointmentFavouriteResponse,
} from '../../api/favouritesService';
import { chainFavouritesService } from '../api/favouritesService';
import { chainAppointmentKeys } from '../api/queryKeys';

const LIMIT = 10;

export function useChainFavourites() {
  return useInfiniteQuery<AppointmentFavouriteStoresResponse, ApiError>({
    queryKey: chainAppointmentKeys.favourites(),
    queryFn: ({ pageParam = 0 }) =>
      chainFavouritesService.getFavouriteBranches({
        offset: pageParam as number,
        limit: LIMIT,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useToggleChainFavourite() {
  const queryClient = useQueryClient();

  return useMutation<
    ToggleAppointmentFavouriteResponse,
    ApiError,
    ToggleAppointmentFavouriteParams
  >({
    mutationFn: chainFavouritesService.toggleFavouriteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chainAppointmentKeys.favourites(),
      });
      queryClient.invalidateQueries({
        queryKey: chainAppointmentKeys.home(),
      });
    },
  });
}
