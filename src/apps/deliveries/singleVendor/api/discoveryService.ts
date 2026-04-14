import apiClient from '../../../../general/api/apiClient';
import type {
  ApiResponse,
  DeliveryBanner,
  DeliveryBannersApiResponse,
  DeliveryBannersParams,
  PaginatedDeliveryResponse,
} from '../../api/types';
import type {
  SingleVendorCategoriesApiResponse,
  SingleVendorCategoryProductsApiResponse,
  SingleVendorCategoryProductsParams,
  SingleVendorCategoriesParams,
  SingleVendorDealsApiResponse,
  SingleVendorDealsParams,
} from './types';

const SINGLE_VENDOR_CATEGORIES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const SINGLE_VENDOR_CATEGORY_PRODUCTS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const SINGLE_VENDOR_DEALS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

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

function toCategoryProductsQueryParams(
  params: SingleVendorCategoryProductsParams,
): Record<string, unknown> {
  const {
    offset = SINGLE_VENDOR_CATEGORY_PRODUCTS_DEFAULTS.offset,
    limit = SINGLE_VENDOR_CATEGORY_PRODUCTS_DEFAULTS.limit,
    search,
    stock,
    subcategory_id,
    price_tiers,
    sort_by,
  } = params;

  return {
    offset,
    limit,
    search: search?.trim() || undefined,
    stock,
    subcategory_id,
    price_tiers: Array.isArray(price_tiers) ? price_tiers[0] : price_tiers,
    sort_by,
  };
}

export const singleVendorDiscoveryService = {
  getBanners: async (
    params: DeliveryBannersParams = {},
  ): Promise<DeliveryBanner[]> => {
    const {
      offset = SINGLE_VENDOR_BANNERS_DEFAULTS.offset,
      limit = SINGLE_VENDOR_BANNERS_DEFAULTS.limit,
    } = params;

    try {
      const response = await apiClient.get<DeliveryBannersApiResponse>(
        '/api/v1/apps/deliveries/discovery/single-vendor/banners',
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
      console.error('single vendor banners request failed', error);
      throw error;
    }
  },

  getCategoriesPage: async (
    params: SingleVendorCategoriesParams = {},
  ): Promise<SingleVendorCategoriesApiResponse> => {
    const {
      offset = SINGLE_VENDOR_CATEGORIES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_CATEGORIES_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<SingleVendorCategoriesApiResponse>(
        '/api/v1/apps/deliveries/discovery/single-vendor/categories',
        { offset, limit },
      );
    } catch (error) {
      console.error('single vendor categories request failed', error);
      throw error;
    }
  },

  getCategoryProducts: async (
    params: SingleVendorCategoryProductsParams,
  ) => {
    const response =
      await singleVendorDiscoveryService.getCategoryProductsPage(params);
    return response.items;
  },

  getCategoryProductsPage: async (
    params: SingleVendorCategoryProductsParams,
  ): Promise<SingleVendorCategoryProductsApiResponse> => {
    const { categoryId } = params;

    try {
      return await apiClient.get<SingleVendorCategoryProductsApiResponse>(
        `/api/v1/apps/deliveries/discovery/single-vendor/categories/${categoryId}/products`,
        toCategoryProductsQueryParams(params),
      );
    } catch (error) {
      console.error('single vendor category products request failed', error);
      throw error;
    }
  },

  getDeals: async (
    params: SingleVendorDealsParams = {},
  ) => {
    const response = await singleVendorDiscoveryService.getDealsPage(params);
    return response.items;
  },

  getDealsPage: async (
    params: SingleVendorDealsParams = {},
  ): Promise<SingleVendorDealsApiResponse> => {
    const {
      offset = SINGLE_VENDOR_DEALS_DEFAULTS.offset,
      limit = SINGLE_VENDOR_DEALS_DEFAULTS.limit,
      search,
      tab,
    } = params;

    try {
      return await apiClient.get<SingleVendorDealsApiResponse>(
        '/api/v1/apps/deliveries/discovery/single-vendor/deals',
        { offset, limit, search, tab },
      );
    } catch (error) {
      console.error('single vendor deals request failed', error);
      throw error;
    }
  },
};
