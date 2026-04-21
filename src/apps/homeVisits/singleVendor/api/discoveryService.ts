import apiClient from '../../../../general/api/apiClient';
import type { HomeVisitsSingleVendorServiceBookingScreenResponse } from '../../types/serviceDetails';
import type {
  HomeVisitsSingleVendorBannersApiResponse,
  HomeVisitsSingleVendorBannersParams,
  HomeVisitsSingleVendorBookingAvailabilityParams,
  HomeVisitsSingleVendorBookingAvailabilityResponse,
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorBookingsApiResponse,
  HomeVisitsSingleVendorBookingsParams,
  HomeVisitsSingleVendorCategoriesApiResponse,
  HomeVisitsSingleVendorCategoriesParams,
  HomeVisitsSingleVendorCategoryServicesApiResponse,
  HomeVisitsSingleVendorCategoryServicesParams,
  HomeVisitsSingleVendorDealsApiResponse,
  HomeVisitsSingleVendorDealsParams,
  HomeVisitsSingleVendorFavoriteServicesApiResponse,
  HomeVisitsSingleVendorFavoriteServicesParams,
  HomeVisitsSingleVendorMostPopularServicesApiResponse,
  HomeVisitsSingleVendorMostPopularServicesParams,
  HomeVisitsSingleVendorNearbyServicesApiResponse,
  HomeVisitsSingleVendorNearbyServicesParams,
  HomeVisitsSingleVendorServiceCenterServicesApiResponse,
  HomeVisitsSingleVendorServiceCenterServicesParams,
  HomeVisitsToggleFavoriteServiceResponse,
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

const SINGLE_VENDOR_BOOKINGS_DEFAULTS = {
  offset: 0,
  limit: 10,
  tab: 'ongoing',
} as const;

const SINGLE_VENDOR_SERVICE_CENTER_SERVICES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const SINGLE_VENDOR_FAVORITE_SERVICES_DEFAULTS = {
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

  getBookingsPage: async (
    params: HomeVisitsSingleVendorBookingsParams,
  ): Promise<HomeVisitsSingleVendorBookingsApiResponse> => {
    const {
      offset = SINGLE_VENDOR_BOOKINGS_DEFAULTS.offset,
      limit = SINGLE_VENDOR_BOOKINGS_DEFAULTS.limit,
      tab = SINGLE_VENDOR_BOOKINGS_DEFAULTS.tab,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorBookingsApiResponse>(
        '/api/v1/apps/home-services/orders/my-bookings',
        { offset, limit, tab },
      );
    } catch (error) {
      console.error('home visits single vendor bookings request failed', error);
      throw error;
    }
  },

  getBookingDetails: async (
    orderId: string,
  ): Promise<HomeVisitsSingleVendorBookingDetails> => {
    try {
      return await apiClient.get<HomeVisitsSingleVendorBookingDetails>(
        `/api/v1/apps/home-services/orders/my-bookings/${orderId}`,
      );
    } catch (error) {
      console.error(
        'home visits single vendor booking details request failed',
        error,
      );
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

  getServiceBookingScreen: async (
    serviceId: string,
  ): Promise<HomeVisitsSingleVendorServiceBookingScreenResponse> => {
    try {
      return await apiClient.get<HomeVisitsSingleVendorServiceBookingScreenResponse>(
        `/api/v1/apps/home-services/services/mobile/${serviceId}/booking-screen`,
      );
    } catch (error) {
      console.error(
        'home visits single vendor service booking screen request failed',
        error,
      );
      throw error;
    }
  },

  getServiceCenterServicesPage: async (
    params: HomeVisitsSingleVendorServiceCenterServicesParams,
  ): Promise<HomeVisitsSingleVendorServiceCenterServicesApiResponse> => {
    const { serviceCenterId } = params;
    const {
      offset = SINGLE_VENDOR_SERVICE_CENTER_SERVICES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_SERVICE_CENTER_SERVICES_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorServiceCenterServicesApiResponse>(
        `/api/v1/apps/home-services/service-centers/${serviceCenterId}/view/services`,
        { offset, limit },
      );
    } catch (error) {
      console.error(
        'home visits single vendor service center services request failed',
        error,
      );
      throw error;
    }
  },

  getBookingAvailability: async (
    params: HomeVisitsSingleVendorBookingAvailabilityParams,
  ): Promise<HomeVisitsSingleVendorBookingAvailabilityResponse> => {
    const { serviceCenterId, date, teamSize } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorBookingAvailabilityResponse>(
        `/api/v1/apps/home-services/service-centers/${serviceCenterId}/booking-availability`,
        {
          date,
          teamSize,
        },
      );
    } catch (error) {
      console.error(
        'home visits single vendor booking availability request failed',
        error,
      );
      throw error;
    }
  },

   getFavoriteServicesPage: async (
    params: HomeVisitsSingleVendorFavoriteServicesParams = {},
  ): Promise<HomeVisitsSingleVendorFavoriteServicesApiResponse> => {
    const {
      offset = SINGLE_VENDOR_FAVORITE_SERVICES_DEFAULTS.offset,
      limit = SINGLE_VENDOR_FAVORITE_SERVICES_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<HomeVisitsSingleVendorFavoriteServicesApiResponse>(
        '/api/v1/apps/home-services/favorite-services',
        { offset, limit },
      );
    } catch (error) {
      console.error(
        'home visits single vendor favorite services request failed',
        error,
      );
      throw error;
    }
  },

  toggleFavoriteService: async (
    serviceId: string,
  ): Promise<HomeVisitsToggleFavoriteServiceResponse> => {
    try {
      return await apiClient.post<HomeVisitsToggleFavoriteServiceResponse>(
        '/api/v1/apps/home-services/favorite-services/toggle',
        { serviceId },
      );
    } catch (error) {
      console.error(
        'home visits single vendor toggle favorite service request failed',
        error,
      );
      throw error;
    }
  },

};
