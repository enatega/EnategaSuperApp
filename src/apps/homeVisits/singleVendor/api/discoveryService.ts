import apiClient from '../../../../general/api/apiClient';
import type {
  HomeVisitsSingleVendorBannersApiResponse,
  HomeVisitsSingleVendorBannersParams,
  HomeVisitsSingleVendorCategoriesApiResponse,
  HomeVisitsSingleVendorCategoriesParams,
  HomeVisitsSingleVendorCategoryServicesApiResponse,
  HomeVisitsSingleVendorCategoryServicesParams,
  HomeVisitsSingleVendorDealsApiResponse,
  HomeVisitsSingleVendorDealsParams,
  HomeVisitsSingleVendorMostPopularServicesApiResponse,
  HomeVisitsSingleVendorMostPopularServicesParams,
  HomeVisitsSingleVendorNearbyServicesApiResponse,
  HomeVisitsSingleVendorNearbyServicesParams,
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

const SINGLE_VENDOR_BANNERS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const SINGLE_VENDOR_NEARBY_SERVICES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const SINGLE_VENDOR_MOST_POPULAR_SERVICES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

export const homeVisitsSingleVendorDiscoveryService = {
  getBanners: async (
    params: HomeVisitsSingleVendorBannersParams = {},
  ) => {
    const response =
      await homeVisitsSingleVendorDiscoveryService.getBannersPage(params);
    return response.items;
  },

  getBannersPage: async (
    params: HomeVisitsSingleVendorBannersParams = {},
  ): Promise<HomeVisitsSingleVendorBannersApiResponse> => {
    const {
      offset = SINGLE_VENDOR_BANNERS_DEFAULTS.offset,
      limit = SINGLE_VENDOR_BANNERS_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorBannersApiResponse>(
        '/api/v1/apps/home-services/discovery/single-vendor/banners',
        { offset, limit },
      );
    } catch (error) {
      console.error('home visits single vendor banners request failed', error);
      throw error;
    }
  },

  getCategoriesPage: async (
    params: HomeVisitsSingleVendorCategoriesParams = {},
  ): Promise<HomeVisitsSingleVendorCategoriesApiResponse> => {
    const {
      offset = SINGLE_VENDOR_CATEGORIES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_CATEGORIES_DEFAULTS.limit,
      search,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorCategoriesApiResponse>(
        '/api/v1/apps/home-services/discovery/single-vendor/categories',
        { offset, limit, search },
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
    const {
      offset = 0,
      limit = 10,
      tab = 'all',
      search,
      category_ids,
      subcategory_id,
      price_tiers,
      latitude,
      longitude,
      sort_by,
    } = params;
    try {
      return await apiClient.get<HomeVisitsSingleVendorDealsApiResponse>(
        '/api/v1/apps/home-services/discovery/single-vendor/deals',
        {
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
        },
      );
    } catch (error) {
      console.error('home visits single vendor deals request failed', error);
      throw error;
    }
  },

  getNearbyServicesPage: async (
    params: HomeVisitsSingleVendorNearbyServicesParams,
  ): Promise<HomeVisitsSingleVendorNearbyServicesApiResponse> => {
    const {
      latitude,
      longitude,
      offset = SINGLE_VENDOR_NEARBY_SERVICES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_NEARBY_SERVICES_DEFAULTS.limit,
      search,
      stock = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.stock,
      category_ids,
      subcategory_id,
      price_tiers,
      sort_by = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.sort_by,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorNearbyServicesApiResponse>(
        '/api/v1/apps/home-services/discovery/nearby-services',
        {
          offset,
          limit,
          search,
          latitude,
          longitude,
          stock,
          category_ids,
          subcategory_id,
          price_tiers,
          sort_by,
        },
      );
    } catch (error) {
      console.error(
        'home visits single vendor nearby services request failed',
        error,
      );
      throw error;
    }
  },

  getMostPopularServicesPage: async (
    params: HomeVisitsSingleVendorMostPopularServicesParams = {},
  ): Promise<HomeVisitsSingleVendorMostPopularServicesApiResponse> => {
    const {
      offset = SINGLE_VENDOR_MOST_POPULAR_SERVICES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_MOST_POPULAR_SERVICES_DEFAULTS.limit,
      search,
      latitude,
      longitude,
      stock = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.stock,
      category_ids,
      subcategory_id,
      price_tiers,
      sort_by = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.sort_by,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorMostPopularServicesApiResponse>(
        '/api/v1/apps/home-services/discovery/most-popular-services',
        {
          offset,
          limit,
          search,
          latitude,
          longitude,
          stock,
          category_ids,
          subcategory_id,
          price_tiers,
          sort_by,
        },
      );
    } catch (error) {
      console.error(
        'home visits single vendor most popular services request failed',
        error,
      );
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
      search,
      latitude,
      longitude,
      stock = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.stock,
      category_ids,
      subcategory_id,
      price_tiers,
      sort_by = SINGLE_VENDOR_CATEGORY_SERVICES_DEFAULTS.sort_by,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorCategoryServicesApiResponse>(
        `/api/v1/apps/home-services/discovery/single-vendor/categories/${categoryId}/services`,
        {
          offset,
          limit,
          search,
          latitude,
          longitude,
          stock,
          category_ids,
          subcategory_id,
          price_tiers,
          sort_by,
        },
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
