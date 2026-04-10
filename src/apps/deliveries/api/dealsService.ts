import apiClient from '../../../general/api/apiClient';
import type {
  DeliveryDealsListingApiResponse,
  DeliveryDealsListingParams,
  DeliveryDealItem,
} from './dealsServiceTypes';
import type { ApiResponse, PaginatedDeliveryResponse } from './types';

const BASE_URL = '/api/v1/apps/deliveries/deals';

const DEALS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

function toDealsQueryParams(
  params: DeliveryDealsListingParams = {},
): Record<string, unknown> {
  const {
    offset = DEALS_DEFAULTS.offset,
    limit = DEALS_DEFAULTS.limit,
    search,
    tab = 'all',
    category_ids,
    subcategory_id,
    price_tiers,
    latitude,
    longitude,
    sort_by,
  } = params;

  return {
    offset,
    limit,
    search,
    tab,
    category_ids,
    subcategory_id,
    price_tiers,
    latitude,
    longitude,
    sort_by,
  };
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

export const dealsService = {
  getDeals: async (
    params: DeliveryDealsListingParams = {},
  ): Promise<DeliveryDealItem[]> => {
    const response = await dealsService.getDealsPage(params);
    return response.items;
  },

  getDealsPage: async (
    params: DeliveryDealsListingParams = {},
  ): Promise<PaginatedDeliveryResponse<DeliveryDealItem>> => {
    const queryParams = toDealsQueryParams(params);
    const offset =
      typeof queryParams.offset === 'number'
        ? queryParams.offset
        : DEALS_DEFAULTS.offset;
    const limit =
      typeof queryParams.limit === 'number'
        ? queryParams.limit
        : DEALS_DEFAULTS.limit;

    try {
      const response = await apiClient.get<DeliveryDealsListingApiResponse>(
        BASE_URL,
        queryParams,
      );

      return toPaginatedResponse(response, { offset, limit });
    } catch (error) {
      console.error('deals listing request failed', error);
      throw error;
    }
  },
};
