import apiClient from '../../../../general/api/apiClient';
import type {
  ApiResponse,
  DeliveryBanner,
  DeliveryBannersApiResponse,
  DeliveryBannersParams,
  PaginatedDeliveryResponse,
} from '../../api/types';

const CHAIN_BANNERS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

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

export const chainDiscoveryService = {
  getBanners: async (
    params: DeliveryBannersParams = {},
  ): Promise<DeliveryBanner[]> => {
    const {
      offset = CHAIN_BANNERS_DEFAULTS.offset,
      limit = CHAIN_BANNERS_DEFAULTS.limit,
    } = params;

    try {
      const response = await apiClient.get<DeliveryBannersApiResponse>(
        '/api/v1/apps/deliveries/discovery/store-chain/banners',
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
      console.error('chain banners request failed', error);
      throw error;
    }
  },
};
