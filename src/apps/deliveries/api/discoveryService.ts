import apiClient from '../../../general/api/apiClient';
import type {
    ApiResponse,
    DeliveryShopType,
    DeliveryShopTypesApiResponse,
    DeliveryShopTypesParams,
    PaginatedDeliveryResponse,
} from './types';

// ---------------------------------------------------------------------------
// Discovery Service – all public deliveries discovery HTTP calls live here
// ---------------------------------------------------------------------------

function isPaginatedShopTypesResponse(
    response: ApiResponse<DeliveryShopType[]> | PaginatedDeliveryResponse<DeliveryShopType>,
): response is PaginatedDeliveryResponse<DeliveryShopType> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedShopTypesResponse(
    response: ApiResponse<DeliveryShopType[]> | PaginatedDeliveryResponse<DeliveryShopType>,
): response is ApiResponse<DeliveryShopType[]> {
    return 'data' in response && Array.isArray(response.data);
}

export const discoveryService = {
    /** Fetch available deliveries shop types for app discovery. */
    getShopTypes: async (
        params: DeliveryShopTypesParams = {},
    ): Promise<DeliveryShopType[]> => {
        const { offset = 0, limit = 10 } = params;
        try {
            const response = await apiClient.get<DeliveryShopTypesApiResponse>(
                '/api/v1/apps/deliveries/discovery/shop-types',
                { offset, limit },
            );

            if (Array.isArray(response)) {
                return response;
            }

            if (isPaginatedShopTypesResponse(response)) {
                return response.items;
            }

            if (isWrappedShopTypesResponse(response)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error('shop types request failed', error);
            throw error;
        }
    },
};
