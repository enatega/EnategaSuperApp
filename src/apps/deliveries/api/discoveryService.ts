import apiClient from '../../../general/api/apiClient';
import type {
    ApiResponse,
    DeliveryBanner,
    DeliveryBannersApiResponse,
    DeliveryBannersParams,
    DeliveryNearbyStore,
    DeliveryNearbyStoresApiResponse,
    DeliveryNearbyStoresParams,
    DeliveryTopBrand,
    DeliveryTopBrandsApiResponse,
    DeliveryTopBrandsParams,
    DeliveryShopType,
    DeliveryShopTypesApiResponse,
    DeliveryShopTypesParams,
    PaginatedDeliveryResponse,
} from './types';

const NEARBY_STORES_DEFAULTS = {
    offset: 0,
    limit: 10,
    latitude: 33.7039543,
    longitude: 72.9680349,
} as const;

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

function isPaginatedTopBrandsResponse(
    response: ApiResponse<DeliveryTopBrand[]> | PaginatedDeliveryResponse<DeliveryTopBrand>,
): response is PaginatedDeliveryResponse<DeliveryTopBrand> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedTopBrandsResponse(
    response: ApiResponse<DeliveryTopBrand[]> | PaginatedDeliveryResponse<DeliveryTopBrand>,
): response is ApiResponse<DeliveryTopBrand[]> {
    return 'data' in response && Array.isArray(response.data);
}

function isPaginatedNearbyStoresResponse(
    response:
        | ApiResponse<DeliveryNearbyStore[]>
        | PaginatedDeliveryResponse<DeliveryNearbyStore>,
): response is PaginatedDeliveryResponse<DeliveryNearbyStore> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedNearbyStoresResponse(
    response:
        | ApiResponse<DeliveryNearbyStore[]>
        | PaginatedDeliveryResponse<DeliveryNearbyStore>,
): response is ApiResponse<DeliveryNearbyStore[]> {
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

    /** Fetch top brands for deliveries home discovery. */
    getTopBrands: async (
        params: DeliveryTopBrandsParams = {},
    ): Promise<DeliveryTopBrand[]> => {
        const { offset = 0, limit = 10 } = params;
        try {
            const response = await apiClient.get<DeliveryTopBrandsApiResponse>(
                '/api/v1/apps/deliveries/discovery/top-brands',
                { offset, limit },
            );

            if (Array.isArray(response)) {
                return response;
            }

            if (isPaginatedTopBrandsResponse(response)) {
                return response.items;
            }

            if (isWrappedTopBrandsResponse(response)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error('top brands request failed', error);
            throw error;
        }
    },

    /** Fetch nearby stores for deliveries home discovery. */
    getNearbyStores: async (
        params: DeliveryNearbyStoresParams = {},
    ): Promise<DeliveryNearbyStore[]> => {
        const {
            offset = NEARBY_STORES_DEFAULTS.offset,
            limit = NEARBY_STORES_DEFAULTS.limit,
            latitude = NEARBY_STORES_DEFAULTS.latitude,
            longitude = NEARBY_STORES_DEFAULTS.longitude,
        } = params;

        try {
            const response = await apiClient.get<DeliveryNearbyStoresApiResponse>(
                '/api/v1/apps/deliveries/discovery/nearby-stores',
                { offset, limit, latitude, longitude },
            );

            if (Array.isArray(response)) {
                return response;
            }

            if (isPaginatedNearbyStoresResponse(response)) {
                return response.items;
            }

            if (isWrappedNearbyStoresResponse(response)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error('nearby stores request failed', error);
            throw error;
        }
    },
};
