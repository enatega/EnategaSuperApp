import apiClient from '../../../../general/api/apiClient';
import type { DeliveryNearbyStore, PaginatedDeliveryResponse } from '../../api/types';

export interface FavouriteStoresParams {
    offset?: number;
    limit?: number;
}

export interface ToggleFavouriteParams {
    storeId: string;
}

export interface ToggleFavouriteResponse {
    message: string;
    isFavorite: boolean;
}

export type FavouriteStoresResponse = PaginatedDeliveryResponse<DeliveryNearbyStore>;

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
        return apiClient.post<ToggleFavouriteResponse>(
            '/api/v1/apps/deliveries/favorite-stores/toggle',
            params,
        );
    },
};
