import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsFavoriteStoresService } from '../api/favoriteStoresService';
import type { HomeVisitsFavoriteServiceCentersApiResponse } from '../api/types';

const FAVORITE_SERVICE_CENTERS_LIMIT = 10;

export default function useFavoriteServiceCenters() {
  const query = useInfiniteQuery<
    HomeVisitsFavoriteServiceCentersApiResponse,
    ApiError
  >({
    queryKey: homeVisitsKeys.favoriteServiceCenters({
      limit: FAVORITE_SERVICE_CENTERS_LIMIT,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsFavoriteStoresService.getFavoriteServiceCentersPage({
        offset: pageParam as number,
        limit: FAVORITE_SERVICE_CENTERS_LIMIT,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 60 * 1000,
  });

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    ...query,
    data: items,
  };
}
