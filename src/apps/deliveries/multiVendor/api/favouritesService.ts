import { ApiError, type ApiNetworkFailureDetails } from '../../../../general/api/apiClient';
import apiClient from '../../../../general/api/apiClient';
import type { DeliveryNearbyStore, PaginatedDeliveryResponse } from '../../api/types';

export interface FavouriteStoresParams {
    offset?: number;
    limit?: number;
}

export interface ToggleFavouriteParams {
    storeId: string;
    nextIsFavorite?: boolean;
}

export interface ToggleFavouriteResponse {
    message: string;
    isFavorite: boolean;
}

type ToggleFavouriteApiResponse =
    | ToggleFavouriteResponse
    | {
        data?: ToggleFavouriteResponse | {
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
    response: ToggleFavouriteApiResponse,
): ToggleFavouriteResponse {
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

export type FavouriteStoresResponse = PaginatedDeliveryResponse<DeliveryNearbyStore>;

function isSuccessfulStreamResetError(error: ApiError): error is ApiError & {
    data: ApiNetworkFailureDetails;
} {
    if (error.status !== 0 || !error.data || typeof error.data !== 'object') {
        return false;
    }

    const requestStatus = typeof error.data.requestStatus === 'number'
        ? error.data.requestStatus
        : Number(error.data.requestStatus);
    const rawResponse = typeof error.data.rawResponse === 'string'
        ? error.data.rawResponse.toLowerCase()
        : '';

    return requestStatus >= 200
        && requestStatus < 300
        && rawResponse.includes('stream was reset: cancel');
}

export const favouritesService = {
    getFavouriteStores: async (
        params: FavouriteStoresParams = {},
    ): Promise<FavouriteStoresResponse> => {
        const { offset = 0, limit = 10 } = params;
        return apiClient.get<FavouriteStoresResponse>(
            '/api/v1/apps/deliveries/favorite-stores',
            { offset, limit },
        );
    },

    toggleFavourite: async (params: ToggleFavouriteParams): Promise<ToggleFavouriteResponse> => {
        console.log('[Deliveries][Favourites] toggle request', params);
        const { storeId, nextIsFavorite } = params;

        try {
            const response = await apiClient.post<ToggleFavouriteApiResponse>(
                '/api/v1/apps/deliveries/favorite-stores/toggle',
                { storeId },
            );
            const normalizedResponse = normalizeToggleFavouriteResponse(response);

            console.log('[Deliveries][Favourites] toggle raw response', response);
            console.log('[Deliveries][Favourites] toggle normalized response', normalizedResponse);

            return normalizedResponse;
        } catch (error) {
            if (
                error instanceof ApiError
                && typeof nextIsFavorite === 'boolean'
                && isSuccessfulStreamResetError(error)
            ) {
                const fallbackResponse = {
                    message: nextIsFavorite
                        ? 'Store added to favorites successfully'
                        : 'Store removed from favorites successfully',
                    isFavorite: nextIsFavorite,
                };

                console.log('[Deliveries][Favourites] toggle fallback success', {
                    storeId,
                    nextIsFavorite,
                    errorData: error.data,
                    fallbackResponse,
                });

                return fallbackResponse;
            }

            throw error;
        }
    },
};
