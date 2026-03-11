import apiClient from '../../../general/api/apiClient';
import type {
    DeliveryShopType,
    DeliveryShopTypesApiResponse,
} from './types';

// ---------------------------------------------------------------------------
// Discovery Service – all public deliveries discovery HTTP calls live here
// ---------------------------------------------------------------------------

export const discoveryService = {
    /** Fetch available deliveries shop types for app discovery. */
    getShopTypes: async (): Promise<DeliveryShopType[]> => {
        const response = await apiClient.get<DeliveryShopTypesApiResponse>(
            '/api/v1/apps/deliveries/discovery/shop-types',
            undefined,
            { skipAuth: true },
        );

        if (Array.isArray(response)) {
            return response;
        }

        return Array.isArray(response.data) ? response.data : [];
    },
};
