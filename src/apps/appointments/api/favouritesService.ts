import { ApiError, type ApiNetworkFailureDetails } from '../../../general/api/apiClient';
import apiClient from '../../../general/api/apiClient';
import type { AppointmentProvider, PaginatedAppointmentsResponse } from './types';

export interface AppointmentFavouriteStoresParams {
  offset?: number;
  limit?: number;
}

export interface ToggleAppointmentFavouriteParams {
  storeId: string;
  nextIsFavorite?: boolean;
}

export interface ToggleAppointmentFavouriteResponse {
  message: string;
  isFavorite: boolean;
}

export type AppointmentFavouriteStoresResponse =
  PaginatedAppointmentsResponse<AppointmentProvider>;

type ToggleAppointmentFavouriteApiResponse =
  | ToggleAppointmentFavouriteResponse
  | {
      data?:
        | ToggleAppointmentFavouriteResponse
        | {
            message?: string;
            isFavorite?: boolean;
            isFavorited?: boolean;
            is_favorite?: boolean;
          };
      message?: string;
      isFavorite?: boolean;
      isFavorited?: boolean;
      is_favorite?: boolean;
    };

function normalizeToggleFavouriteResponse(
  response: ToggleAppointmentFavouriteApiResponse,
): ToggleAppointmentFavouriteResponse {
  const payload =
    response && typeof response === 'object' && 'data' in response && response.data
      ? response.data
      : response;

  const resolvedMessage =
    typeof payload?.message === 'string' && payload.message.trim().length > 0
      ? payload.message
      : typeof response?.message === 'string' && response.message.trim().length > 0
        ? response.message
        : '';
  const resolvedIsFavorite =
    typeof payload?.isFavorite === 'boolean'
      ? payload.isFavorite
      : typeof payload?.isFavorited === 'boolean'
        ? payload.isFavorited
        : typeof payload?.is_favorite === 'boolean'
          ? payload.is_favorite
          : typeof response?.isFavorite === 'boolean'
            ? response.isFavorite
            : typeof response?.isFavorited === 'boolean'
              ? response.isFavorited
              : typeof response?.is_favorite === 'boolean'
                ? response.is_favorite
                : false;

  return {
    message: resolvedMessage,
    isFavorite: resolvedIsFavorite,
  };
}

function isSuccessfulStreamResetError(error: ApiError): error is ApiError & {
  data: ApiNetworkFailureDetails;
} {
  if (error.status !== 0 || !error.data || typeof error.data !== 'object') {
    return false;
  }

  const requestStatus =
    typeof error.data.requestStatus === 'number'
      ? error.data.requestStatus
      : Number(error.data.requestStatus);
  const rawResponse =
    typeof error.data.rawResponse === 'string'
      ? error.data.rawResponse.toLowerCase()
      : '';

  return (
    requestStatus >= 200 &&
    requestStatus < 300 &&
    rawResponse.includes('stream was reset: cancel')
  );
}

export const appointmentFavouritesService = {
  getFavouriteStores: async (
    params: AppointmentFavouriteStoresParams = {},
  ): Promise<AppointmentFavouriteStoresResponse> => {
    const { offset = 0, limit = 10 } = params;

    return apiClient.get<AppointmentFavouriteStoresResponse>(
      '/api/v1/apps/general-bookings/favorite-stores',
      { offset, limit },
    );
  },

  toggleFavourite: async (
    params: ToggleAppointmentFavouriteParams,
  ): Promise<ToggleAppointmentFavouriteResponse> => {
    const { storeId, nextIsFavorite } = params;

    try {
      const response = await apiClient.post<ToggleAppointmentFavouriteApiResponse>(
        '/api/v1/apps/general-bookings/favorite-stores/toggle',
        { storeId },
      );

      return normalizeToggleFavouriteResponse(response);
    } catch (error) {
      if (
        error instanceof ApiError &&
        typeof nextIsFavorite === 'boolean' &&
        isSuccessfulStreamResetError(error)
      ) {
        return {
          message: nextIsFavorite
            ? 'Store added to favorites successfully'
            : 'Store removed from favorites successfully',
          isFavorite: nextIsFavorite,
        };
      }

      throw error;
    }
  },
};
