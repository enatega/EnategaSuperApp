import apiClient from '../../../../general/api/apiClient';
import type {
  HomeVisitsMultiVendorMainServicesApiResponse,
  HomeVisitsMultiVendorMainServicesParams,
  HomeVisitsMultiVendorMainServiceCategoriesApiResponse,
  HomeVisitsMultiVendorMainServiceCategoriesParams,
  HomeVisitsMultiVendorDealsApiResponse,
  HomeVisitsMultiVendorDealsParams,
  HomeVisitsMultiVendorNearbyServicesApiResponse,
  HomeVisitsMultiVendorNearbyServicesParams,
  HomeVisitsMultiVendorProvidersApiResponse,
  HomeVisitsMultiVendorProvidersParams,
} from './types';

const MULTI_VENDOR_DISCOVERY_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

export const homeVisitsMultiVendorDiscoveryService = {
  getMainServicesPage: async (
    params: HomeVisitsMultiVendorMainServicesParams = {},
  ): Promise<HomeVisitsMultiVendorMainServicesApiResponse> => {
    const {
      offset = MULTI_VENDOR_DISCOVERY_DEFAULTS.offset,
      limit = MULTI_VENDOR_DISCOVERY_DEFAULTS.limit,
      search,
    } = params;

    try {
      return await apiClient.get<HomeVisitsMultiVendorMainServicesApiResponse>(
        '/api/v1/apps/home-services/discovery/multi-vendor/service-types',
        { offset, limit, search },
      );
    } catch (error) {
      console.error('home visits multi vendor main services request failed', error);
      throw error;
    }
  },

  getMainServiceCategoriesPage: async (
    params: HomeVisitsMultiVendorMainServiceCategoriesParams,
  ): Promise<HomeVisitsMultiVendorMainServiceCategoriesApiResponse> => {
    const {
      mainServiceId,
      offset = MULTI_VENDOR_DISCOVERY_DEFAULTS.offset,
      limit = MULTI_VENDOR_DISCOVERY_DEFAULTS.limit,
      search,
    } = params;

    try {
      return await apiClient.get<HomeVisitsMultiVendorMainServiceCategoriesApiResponse>(
        `/api/v1/apps/home-services/discovery/multi-vendor/main-services/${mainServiceId}/categories`,
        { offset, limit, search },
      );
    } catch (error) {
      console.error(
        'home visits multi vendor main service categories request failed',
        error,
      );
      throw error;
    }
  },

  getProvidersPage: async (
    params: HomeVisitsMultiVendorProvidersParams = {},
    scope: 'top-centers' | 'service-providers' = 'top-centers',
  ): Promise<HomeVisitsMultiVendorProvidersApiResponse> => {
    const {
      offset = MULTI_VENDOR_DISCOVERY_DEFAULTS.offset,
      limit = MULTI_VENDOR_DISCOVERY_DEFAULTS.limit,
      search,
      mainServiceId,
      latitude,
      longitude,
    } = params;

    try {
      return await apiClient.get<HomeVisitsMultiVendorProvidersApiResponse>(
        `/api/v1/apps/home-services/discovery/multi-vendor/${scope}`,
        { offset, limit, search, mainServiceId, latitude, longitude },
      );
    } catch (error) {
      console.error('home visits multi vendor providers request failed', error);
      throw error;
    }
  },

  getDealsPage: async (
    params: HomeVisitsMultiVendorDealsParams = {},
  ): Promise<HomeVisitsMultiVendorDealsApiResponse> => {
    const {
      offset = MULTI_VENDOR_DISCOVERY_DEFAULTS.offset,
      limit = MULTI_VENDOR_DISCOVERY_DEFAULTS.limit,
      search,
      mainServiceId,
      providerId,
      latitude,
      longitude,
      stock = 'all',
      category_ids,
      subcategory_id,
      price_tiers,
      sort_by = 'recommended',
    } = params;

    try {
      return await apiClient.get<HomeVisitsMultiVendorDealsApiResponse>(
        '/api/v1/apps/home-services/discovery/multi-vendor/deals',
        {
          offset,
          limit,
          search,
          mainServiceId,
          providerId,
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
      console.error('home visits multi vendor deals request failed', error);
      throw error;
    }
  },

  getNearbyServicesPage: async (
    params: HomeVisitsMultiVendorNearbyServicesParams = {},
  ): Promise<HomeVisitsMultiVendorNearbyServicesApiResponse> => {
    const {
      offset = MULTI_VENDOR_DISCOVERY_DEFAULTS.offset,
      limit = MULTI_VENDOR_DISCOVERY_DEFAULTS.limit,
      search,
      mainServiceId,
      providerId,
      latitude,
      longitude,
      stock = 'all',
      category_ids,
      subcategory_id,
      price_tiers,
      sort_by = 'recommended',
    } = params;

    try {
      return await apiClient.get<HomeVisitsMultiVendorNearbyServicesApiResponse>(
        '/api/v1/apps/home-services/discovery/multi-vendor/nearby-services',
        {
          offset,
          limit,
          search,
          mainServiceId,
          providerId,
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
      console.error('home visits multi vendor nearby services request failed', error);
      throw error;
    }
  },
};
