import apiClient from '../../../../general/api/apiClient';
import type {
  AppointmentFavouriteStoresParams,
  AppointmentFavouriteStoresResponse,
  ToggleAppointmentFavouriteParams,
  ToggleAppointmentFavouriteResponse,
} from '../../api/favouritesService';

export const chainFavouritesService = {
  getFavouriteBranches: async (
    params: AppointmentFavouriteStoresParams = {},
  ): Promise<AppointmentFavouriteStoresResponse> => {
    const { offset = 0, limit = 10 } = params;

    return apiClient.get<AppointmentFavouriteStoresResponse>(
      '/api/v1/apps/general-bookings/favorite-stores/store-chain',
      { offset, limit },
    );
  },

  toggleFavouriteBranch: async (
    params: ToggleAppointmentFavouriteParams,
  ): Promise<ToggleAppointmentFavouriteResponse> =>
    apiClient.post<ToggleAppointmentFavouriteResponse>(
      '/api/v1/apps/general-bookings/favorite-stores/store-chain/toggle',
      { storeId: params.storeId },
    ),
};
