import apiClient from '../../../../general/api/apiClient';
import type {
  HomeVisitsFavoriteServiceCentersApiResponse,
  HomeVisitsFavoriteServiceCentersParams,
  HomeVisitsToggleFavoriteServiceCenterResponse,
} from './types';

type ToggleFavoriteServiceCenterApiResponse =
  | HomeVisitsToggleFavoriteServiceCenterResponse
  | {
      data?: Partial<HomeVisitsToggleFavoriteServiceCenterResponse> & {
        isFavorited?: boolean;
        is_favorite?: boolean;
      };
      message?: string;
      isFavorite?: boolean;
      isFavorited?: boolean;
      is_favorite?: boolean;
    };

function normalizeToggleFavoriteResponse(
  response: ToggleFavoriteServiceCenterApiResponse,
): HomeVisitsToggleFavoriteServiceCenterResponse {
  const payload =
    response && typeof response === 'object' && 'data' in response && response.data
      ? response.data
      : response;

  const message =
    typeof payload?.message === 'string' && payload.message.trim().length > 0
      ? payload.message
      : typeof response?.message === 'string'
        ? response.message
        : '';

  const isFavorite =
    typeof payload?.isFavorite === 'boolean'
      ? payload.isFavorite
      : typeof response?.isFavorite === 'boolean'
        ? response.isFavorite
        : typeof response?.isFavorited === 'boolean'
          ? response.isFavorited
          : typeof response?.is_favorite === 'boolean'
            ? response.is_favorite
            : false;

  return { isFavorite, message };
}

export const homeVisitsFavoriteStoresService = {
  getFavoriteServiceCentersPage: async (
    params: HomeVisitsFavoriteServiceCentersParams = {},
  ): Promise<HomeVisitsFavoriteServiceCentersApiResponse> => {
    const { offset = 0, limit = 10 } = params;

    return apiClient.get<HomeVisitsFavoriteServiceCentersApiResponse>(
      '/api/v1/apps/home-services/favorite-stores',
      { offset, limit },
    );
  },

  toggleFavoriteServiceCenter: async (
    serviceCenterId: string,
  ): Promise<HomeVisitsToggleFavoriteServiceCenterResponse> => {
    const response = await apiClient.post<ToggleFavoriteServiceCenterApiResponse>(
      '/api/v1/apps/home-services/favorite-stores/toggle',
      { serviceCenterId },
    );

    return normalizeToggleFavoriteResponse(response);
  },
};
