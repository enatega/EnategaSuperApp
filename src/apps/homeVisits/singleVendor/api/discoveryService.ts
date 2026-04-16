import apiClient from '../../../../general/api/apiClient';
import type {
  ApiResponse,
  DeliveryBanner,
  PaginatedDeliveryResponse,
} from '../../../deliveries/api/types';

type HomeServicesBannersParams = {
  offset?: number;
  limit?: number;
  search?: string;
};

const SINGLE_VENDOR_BANNERS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

function isPaginatedBannersResponse(
  response:
    | ApiResponse<DeliveryBanner[]>
    | PaginatedDeliveryResponse<DeliveryBanner>,
): response is PaginatedDeliveryResponse<DeliveryBanner> {
  return 'items' in response && Array.isArray(response.items);
}

function isWrappedBannersResponse(
  response:
    | ApiResponse<DeliveryBanner[]>
    | PaginatedDeliveryResponse<DeliveryBanner>,
): response is ApiResponse<DeliveryBanner[]> {
  return 'data' in response && Array.isArray(response.data);
}

export const singleVendorDiscoveryService = {
  getBanners: async (
    params: HomeServicesBannersParams = {},
  ): Promise<DeliveryBanner[]> => {
    const {
      offset = SINGLE_VENDOR_BANNERS_DEFAULTS.offset,
      limit = SINGLE_VENDOR_BANNERS_DEFAULTS.limit,
      // Intentionally ignored for this endpoint.
      search: _search,
    } = params;
    void _search;

    try {
      console.log('home services single vendor banners request', { offset, limit });

      const response = await apiClient.get<
        ApiResponse<DeliveryBanner[]> | PaginatedDeliveryResponse<DeliveryBanner>
      >('/api/v1/apps/home-services/discovery/single-vendor/banners', {
        offset,
        limit,
      });

      if (Array.isArray(response)) {
        console.log('home services single vendor banners response', {
          count: response.length,
        });
        return response;
      }

      if (isPaginatedBannersResponse(response)) {
        console.log('home services single vendor banners response', {
          count: response.items.length,
        });
        return response.items;
      }

      if (isWrappedBannersResponse(response)) {
        console.log('home services single vendor banners response', {
          count: response.data.length,
        });
        return response.data;
      }

      console.log('home services single vendor banners response', { count: 0 });
      return [];
    } catch (error) {
      console.error('home services single vendor banners request failed', error);
      throw error;
    }
  },
};
