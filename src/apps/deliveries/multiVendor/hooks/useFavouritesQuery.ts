import { useInfiniteQuery } from '@tanstack/react-query';
import { ApiError } from '../../../../general/api/apiClient';
import { favouriteKeys } from '../../api/queryKeys';
import { favouritesService, type FavouriteStoresResponse } from '../api/favouritesService';

const LIMIT = 10;

export function useFavouritesQuery() {
    return useInfiniteQuery<FavouriteStoresResponse, ApiError>({
        queryKey: favouriteKeys.list(),
        queryFn: ({ pageParam = 0 }) =>
            favouritesService.getFavouriteStores({ offset: pageParam as number, limit: LIMIT }),
        getNextPageParam: (lastPage) =>
            lastPage.isEnd ? undefined : lastPage.nextOffset,
        initialPageParam: 0,
        staleTime: 2 * 60 * 1000,
    });
}
