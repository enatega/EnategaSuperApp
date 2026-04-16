import apiClient from '../../../../general/api/apiClient';
import type {
  HomeVisitsSingleVendorCategoriesApiResponse,
  HomeVisitsSingleVendorCategoriesParams,
  HomeVisitsSingleVendorCategoryServicesApiResponse,
  HomeVisitsSingleVendorCategoryServicesParams,
  HomeVisitsSingleVendorDealsApiResponse,
  HomeVisitsSingleVendorDealsParams,
} from './types';

const SINGLE_VENDOR_CATEGORIES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS = {
  offset: 0,
  limit: 10,
  stock: 'all',
  sort_by: 'recommended',
} as const;

export const homeVisitsSingleVendorDiscoveryService = {
  getCategoriesPage: async (
    params: HomeVisitsSingleVendorCategoriesParams = {},
  ): Promise<HomeVisitsSingleVendorCategoriesApiResponse> => {
    const {
      offset = SINGLE_VENDOR_CATEGORIES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_CATEGORIES_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorCategoriesApiResponse>(
        '/api/v1/apps/home-services/discovery/single-vendor/categories',
        { offset, limit },
      );
    } catch (error) {
      console.error('home visits single vendor categories request failed', error);
      throw error;
    }
  },

  getCategoryServices: async (
    params: HomeVisitsSingleVendorCategoryServicesParams,
  ) => {
    const response =
      await homeVisitsSingleVendorDiscoveryService.getCategoryServicesPage(
        params,
      );
    return response.items;
  },

  getDealsPage: async (
    params: HomeVisitsSingleVendorDealsParams = {},
  ): Promise<HomeVisitsSingleVendorDealsApiResponse> => {
    const { offset = 0, limit = 10, tab = 'all' } = params;
    try {
      return await apiClient.get<HomeVisitsSingleVendorDealsApiResponse>(
        '/api/v1/apps/home-services/discovery/single-vendor/deals',
        { offset, limit, tab },
      );
    } catch (error) {
      console.error('home visits single vendor deals request failed', error);
      throw error;
    }
  },

  getCategoryServicesPage: async (
    params: HomeVisitsSingleVendorCategoryServicesParams,
  ): Promise<HomeVisitsSingleVendorCategoryServicesApiResponse> => {
    const { categoryId } = params;
    const {
      offset = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.limit,
      stock = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.stock,
      sort_by = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.sort_by,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorCategoryServicesApiResponse>(
        `/api/v1/apps/home-services/discovery/single-vendor/categories/${categoryId}/services`,
        { offset, limit, stock, sort_by },
      );
    } catch (error) {
      console.error(
        'home visits single vendor category services request failed',
        error,
      );
      throw error;
    }
  },
};
