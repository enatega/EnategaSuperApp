import apiClient from '../../../general/api/apiClient';
import type {
    ApiResponse,
    DeliveryBanner,
    DeliveryBannersApiResponse,
    DeliveryBannersParams,
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

function isPaginatedBannersResponse(
    response: ApiResponse<DeliveryBanner[]> | PaginatedDeliveryResponse<DeliveryBanner>,
): response is PaginatedDeliveryResponse<DeliveryBanner> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedBannersResponse(
    response: ApiResponse<DeliveryBanner[]> | PaginatedDeliveryResponse<DeliveryBanner>,
): response is ApiResponse<DeliveryBanner[]> {
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

    /** Fetch mobile banners for deliveries home discovery. */
    getMobileBanners: async (
        params: DeliveryBannersParams = {},
    ): Promise<DeliveryBanner[]> => {
        const { offset = 0, limit = 10 } = params;
        try {
            const response = await apiClient.get<DeliveryBannersApiResponse>(
                '/api/v1/deliveries/banners/mobile',
                { offset, limit },
            );

            if (Array.isArray(response)) {
                return response;
            }

            if (isPaginatedBannersResponse(response)) {
                return response.items;
            }

            if (isWrappedBannersResponse(response)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error('mobile banners request failed', error);
            throw error;
        }
    },
};
