import apiClient from '../../../general/api/apiClient';
import type { ApiResponse, PaginatedDeliveryResponse } from './types';
import type {
  DeliveryShopTypeCategoriesApiResponse,
  DeliveryShopTypeCategoriesParams,
  DeliveryShopTypeCategory,
} from './categoriesServicesTypes';

const CATEGORIES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

function toShopTypeCategoriesQueryParams(
  params: DeliveryShopTypeCategoriesParams,
): Record<string, unknown> {
  const {
    offset = CATEGORIES_DEFAULTS.offset,
    limit = CATEGORIES_DEFAULTS.limit,
  } = params;

  return {
    offset,
    limit,
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

export const categoriesServices = {
  getShopTypeCategories: async (
    params: DeliveryShopTypeCategoriesParams,
  ): Promise<DeliveryShopTypeCategory[]> => {
    const response = await categoriesServices.getShopTypeCategoriesPage(params);
    return response.items;
  },

  getShopTypeCategoriesPage: async (
    params: DeliveryShopTypeCategoriesParams,
  ): Promise<PaginatedDeliveryResponse<DeliveryShopTypeCategory>> => {
    const { shopTypeId } = params;
    const queryParams = toShopTypeCategoriesQueryParams(params);
    const offset =
      typeof queryParams.offset === 'number'
        ? queryParams.offset
        : CATEGORIES_DEFAULTS.offset;
    const limit =
      typeof queryParams.limit === 'number'
        ? queryParams.limit
        : CATEGORIES_DEFAULTS.limit;

    try {
      const response = await apiClient.get<DeliveryShopTypeCategoriesApiResponse>(
        `/api/v1/apps/deliveries/discovery/shop-types/${shopTypeId}/categories`,
        queryParams,
      );

      return toPaginatedResponse(response, { offset, limit });
    } catch (error) {
      console.error('shop type categories request failed', error);
      throw error;
    }
  },
};
