import apiClient from '../../../general/api/apiClient';
import type {
    ApiResponse,
    DeliveryBanner,
    DeliveryDealsApiResponse,
    DeliveryDealsParams,
    DeliveryBannersApiResponse,
    DeliveryBannersParams,
    DeliveryNearbyStore,
    DeliveryNearbyStoresApiResponse,
    DeliveryNearbyStoresParams,
    DeliveryOrderAgainApiResponse,
    DeliveryOrderAgainItem,
    DeliveryOrderAgainParams,
    DeliveryTopBrand,
    DeliveryTopBrandsApiResponse,
    DeliveryTopBrandsParams,
    DeliveryShopType,
    DeliveryShopTypeProduct,
    DeliveryShopTypeProductsApiResponse,
    DeliveryShopTypeProductsParams,
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

const DEALS_DEFAULTS = {
    offset: 0,
    limit: 10,
} as const;

const ORDER_AGAIN_DEFAULTS = {
    offset: 0,
    limit: 10,
} as const;

const SHOP_TYPE_PRODUCTS_DEFAULTS = {
    offset: 0,
    limit: 5,
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

function isPaginatedDealsResponse(
    response:
        | ApiResponse<DeliveryNearbyStore[]>
        | PaginatedDeliveryResponse<DeliveryNearbyStore>,
): response is PaginatedDeliveryResponse<DeliveryNearbyStore> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedDealsResponse(
    response:
        | ApiResponse<DeliveryNearbyStore[]>
        | PaginatedDeliveryResponse<DeliveryNearbyStore>,
): response is ApiResponse<DeliveryNearbyStore[]> {
    return 'data' in response && Array.isArray(response.data);
}

function isPaginatedOrderAgainResponse(
    response:
        | ApiResponse<DeliveryOrderAgainItem[]>
        | PaginatedDeliveryResponse<DeliveryOrderAgainItem>,
): response is PaginatedDeliveryResponse<DeliveryOrderAgainItem> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedOrderAgainResponse(
    response:
        | ApiResponse<DeliveryOrderAgainItem[]>
        | PaginatedDeliveryResponse<DeliveryOrderAgainItem>,
): response is ApiResponse<DeliveryOrderAgainItem[]> {
    return 'data' in response && Array.isArray(response.data);
}

function isPaginatedShopTypeProductsResponse(
    response:
        | ApiResponse<DeliveryShopTypeProduct[]>
        | PaginatedDeliveryResponse<DeliveryShopTypeProduct>,
): response is PaginatedDeliveryResponse<DeliveryShopTypeProduct> {
    return 'items' in response && Array.isArray(response.items);
}

function isWrappedShopTypeProductsResponse(
    response:
        | ApiResponse<DeliveryShopTypeProduct[]>
        | PaginatedDeliveryResponse<DeliveryShopTypeProduct>,
): response is ApiResponse<DeliveryShopTypeProduct[]> {
    return 'data' in response && Array.isArray(response.data);
}

function toPaginatedResponse<T>(
    response: ApiResponse<T[]> | PaginatedDeliveryResponse<T> | T[],
    params: { offset: number; limit: number },
): PaginatedDeliveryResponse<T> {
    if (Array.isArray(response)) {
        return {
            items: response,
            offset: params.offset,
            limit: params.limit,
            total: response.length,
            isEnd: response.length < params.limit,
            nextOffset: response.length < params.limit ? null : params.offset + params.limit,
        };
    }

    if ('items' in response && Array.isArray(response.items)) {
        return response;
    }

    const items = 'data' in response && Array.isArray(response.data) ? response.data : [];

    return {
        items,
        offset: params.offset,
        limit: params.limit,
        total: items.length,
        isEnd: items.length < params.limit,
        nextOffset: items.length < params.limit ? null : params.offset + params.limit,
    };
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

    /** Fetch products for a specific shop type in deliveries discovery. */
    getShopTypeProducts: async (
        params: DeliveryShopTypeProductsParams,
    ): Promise<DeliveryShopTypeProduct[]> => {
        const response = await discoveryService.getShopTypeProductsPage(params);
        return response.items;
    },

    /** Fetch products for a specific shop type in deliveries discovery. */
    getShopTypeProductsPage: async (
        params: DeliveryShopTypeProductsParams,
    ): Promise<PaginatedDeliveryResponse<DeliveryShopTypeProduct>> => {
        const {
            shopTypeId,
            offset = SHOP_TYPE_PRODUCTS_DEFAULTS.offset,
            limit = SHOP_TYPE_PRODUCTS_DEFAULTS.limit,
            search = '',
        } = params;

        try {
            const response = await apiClient.get<DeliveryShopTypeProductsApiResponse>(
                `/api/v1/apps/deliveries/discovery/shop-types/${shopTypeId}/products`,
                { offset, limit, search },
            );

            return toPaginatedResponse(response, { offset, limit });
        } catch (error) {
            console.error('shop type products request failed', error);
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
    getNearbyStoresPage: async (
        params: DeliveryNearbyStoresParams = {},
    ): Promise<PaginatedDeliveryResponse<DeliveryNearbyStore>> => {
        const {
            offset = NEARBY_STORES_DEFAULTS.offset,
            limit = NEARBY_STORES_DEFAULTS.limit,
            search = '',
            latitude = NEARBY_STORES_DEFAULTS.latitude,
            longitude = NEARBY_STORES_DEFAULTS.longitude,
        } = params;

        try {
            const response = await apiClient.get<DeliveryNearbyStoresApiResponse>(
                '/api/v1/apps/deliveries/discovery/nearby-stores',
                { offset, limit, search, latitude, longitude },
            );

            return toPaginatedResponse(response, { offset, limit });
        } catch (error) {
            console.error('nearby stores request failed', error);
            throw error;
        }
    },

    /** Fetch deals for deliveries home discovery. */
    getDeals: async (
        params: DeliveryDealsParams = {},
    ): Promise<DeliveryNearbyStore[]> => {
        const response = await discoveryService.getDealsPage(params);
        return response.items;
    },

    /** Fetch deals for deliveries home discovery. */
    getDealsPage: async (
        params: DeliveryDealsParams = {},
    ): Promise<PaginatedDeliveryResponse<DeliveryNearbyStore>> => {
        const { offset = DEALS_DEFAULTS.offset, limit = DEALS_DEFAULTS.limit } = params;

        try {
            const response = await apiClient.get<DeliveryDealsApiResponse>(
                '/api/v1/apps/deliveries/deals/home',
                { offset, limit },
            );

            return toPaginatedResponse(response, { offset, limit });
        } catch (error) {
            console.error('deals request failed', error);
            throw error;
        }
    },

    /** Fetch order again products for deliveries home discovery. */
    getOrderAgain: async (
        params: DeliveryOrderAgainParams = {},
    ): Promise<DeliveryOrderAgainItem[]> => {
        const {
            offset = ORDER_AGAIN_DEFAULTS.offset,
            limit = ORDER_AGAIN_DEFAULTS.limit,
        } = params;

        try {
            const response = await apiClient.get<DeliveryOrderAgainApiResponse>(
                '/api/v1/apps/deliveries/discovery/order-again',
                { offset, limit },
            );

            if (Array.isArray(response)) {
                return response;
            }

            if (isPaginatedOrderAgainResponse(response)) {
                return response.items;
            }

            if (isWrappedOrderAgainResponse(response)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error('order again request failed', error);
            throw error;
        }
    }
};
