import { useInfiniteQuery } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import { appointmentFavouriteKeys } from '../api/queryKeys';
import {
  appointmentFavouritesService,
  type AppointmentFavouriteStoresResponse,
} from '../api/favouritesService';

const LIMIT = 10;

export function useFavouritesQuery() {
  return useInfiniteQuery<AppointmentFavouriteStoresResponse, ApiError>({
    queryKey: appointmentFavouriteKeys.list(),
    queryFn: ({ pageParam = 0 }) =>
      appointmentFavouritesService.getFavouriteStores({
        offset: pageParam as number,
        limit: LIMIT,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 2 * 60 * 1000,
  });
}
