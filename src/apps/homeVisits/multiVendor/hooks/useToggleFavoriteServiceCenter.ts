import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsFavoriteStoresService } from '../api/favoriteStoresService';
import type { HomeVisitsToggleFavoriteServiceCenterResponse } from '../api/types';

export default function useToggleFavoriteServiceCenter() {
  const queryClient = useQueryClient();

  return useMutation<
    HomeVisitsToggleFavoriteServiceCenterResponse,
    ApiError,
    string
  >({
    mutationFn: (serviceCenterId) =>
      homeVisitsFavoriteStoresService.toggleFavoriteServiceCenter(
        serviceCenterId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homeVisitsKeys.discovery() });
      queryClient.invalidateQueries({
        queryKey: homeVisitsKeys.favoriteServiceCenters(),
      });
    },
  });
}
