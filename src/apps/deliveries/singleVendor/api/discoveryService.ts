import apiClient from '../../../../general/api/apiClient';
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

export const singleVendorDiscoveryService = {
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
    const {
      offset = SINGLE_VENDOR_CATEGORY_PRODUCTS_DEFAULTS.offset,
      limit = SINGLE_VENDOR_CATEGORY_PRODUCTS_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<SingleVendorCategoryProductsApiResponse>(
        `/api/v1/apps/deliveries/discovery/single-vendor/categories/${categoryId}/products`,
        { offset, limit },
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
