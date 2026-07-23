import apiClient from '../../../general/api/apiClient';
import type {
  ApiResponse,
  AppointmentBanner,
  AppointmentBannersApiResponse,
  AppointmentBrandsApiResponse,
  AppointmentCategory,
  AppointmentCategoriesApiResponse,
  AppointmentListParams,
  AppointmentNearbyProvidersApiResponse,
  AppointmentNearbyProvidersParams,
  AppointmentOrderAgainApiResponse,
  AppointmentOrderAgainItem,
  AppointmentOrderAgainParams,
  AppointmentProvider,
  AppointmentSearchSuggestion,
  AppointmentSearchSuggestionsApiResponse,
  AppointmentShopType,
  AppointmentShopTypeCategoriesParams,
  AppointmentShopTypesApiResponse,
  AppointmentStoreServicesApiResponse,
  AppointmentStoreServicesParams,
  AppointmentStoreViewApiResponse,
  AppointmentTopBrand,
  AppointmentTopBrandsApiResponse,
  AppointmentTopBrandsParams,
  PaginatedAppointmentsResponse,
} from './types';

const DEFAULT_NEARBY_COORDINATES = {
  latitude: 33.7039543,
  longitude: 72.9680349,
} as const;

function isPaginatedResponse<T>(
  response: ApiResponse<T[]> | PaginatedAppointmentsResponse<T>,
): response is PaginatedAppointmentsResponse<T> {
  return 'items' in response && Array.isArray(response.items);
}

function isWrappedResponse<T>(
  response: ApiResponse<T[]> | PaginatedAppointmentsResponse<T>,
): response is ApiResponse<T[]> {
  return 'data' in response && Array.isArray(response.data);
}

function unwrapListResponse<T>(
  response: ApiResponse<T[]> | PaginatedAppointmentsResponse<T> | T[],
): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (isPaginatedResponse(response)) {
    return response.items;
  }

  if (isWrappedResponse(response)) {
    return response.data;
  }

  return [];
}

function toTopBrandsQueryParams(
  params: AppointmentTopBrandsParams = {},
): Record<string, unknown> {
  return {
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
    search: params.search,
  };
}

function toNearbyProvidersQueryParams(
  params: AppointmentNearbyProvidersParams = {},
): Record<string, unknown> {
  return {
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
    search: params.search ?? '',
    latitude: params.latitude ?? DEFAULT_NEARBY_COORDINATES.latitude,
    longitude: params.longitude ?? DEFAULT_NEARBY_COORDINATES.longitude,
    category_id: params.category_id,
    category_ids: params.category_ids,
    shop_type_id: params.shop_type_id,
    subcategory_id: params.subcategory_id,
    stock: params.stock,
    price_tiers: params.price_tiers,
    sort_by: params.sort_by,
  };
}

function toBrandsQueryParams(
  params: AppointmentListParams = {},
): Record<string, unknown> {
  return {
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
    search: params.search,
    latitude: params.latitude ?? DEFAULT_NEARBY_COORDINATES.latitude,
    longitude: params.longitude ?? DEFAULT_NEARBY_COORDINATES.longitude,
  };
}

function toOrderAgainQueryParams(
  params: AppointmentOrderAgainParams = {},
): Record<string, unknown> {
  return {
    offset: params.offset ?? 0,
    limit: params.limit ?? 10,
    search: params.search,
    category_id: params.category_id,
    category_ids: params.category_ids,
    shop_type_id: params.shop_type_id,
    subcategory_id: params.subcategory_id,
  };
}

export const appointmentsDiscoveryService = {
  getBanners: async (
    params: AppointmentListParams = {},
  ): Promise<AppointmentBanner[]> => {
    const response = await appointmentsDiscoveryService.getBannersPage(params);
    return response.items;
  },

  getBannersPage: async (
    params: AppointmentListParams = {},
  ): Promise<AppointmentBannersApiResponse> => {
    return await apiClient.get<AppointmentBannersApiResponse>(
      '/api/v1/general-bookings/banners/mobile',
      {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
      },
    );
  },

  getShopTypes: async (
    params: AppointmentListParams = {},
  ): Promise<AppointmentShopType[]> => {
    const response = await apiClient.get<AppointmentShopTypesApiResponse>(
      '/api/v1/apps/general-bookings/discovery/shop-types',
      {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
        search: params.search,
      },
    );

    return unwrapListResponse(response);
  },

  getSearchSuggestions: async (
    params: AppointmentListParams = {},
  ): Promise<AppointmentSearchSuggestion[]> => {
    const response = await apiClient.get<AppointmentSearchSuggestionsApiResponse>(
      '/api/v1/apps/general-bookings/discovery/search-suggestions',
      {
        offset: params.offset ?? 0,
        limit: params.limit ?? 20,
        search: params.search,
      },
    );

    return unwrapListResponse(response);
  },

  getShopTypeCategories: async (
    params: AppointmentShopTypeCategoriesParams,
  ): Promise<AppointmentCategory[]> => {
    const response =
      await appointmentsDiscoveryService.getShopTypeCategoriesPage(params);

    return unwrapListResponse(response);
  },

  getShopTypeCategoriesPage: async (
    params: AppointmentShopTypeCategoriesParams,
  ): Promise<AppointmentCategoriesApiResponse> => {
    return await apiClient.get<AppointmentCategoriesApiResponse>(
      `/api/v1/apps/general-bookings/discovery/shop-types/${params.shopTypeId}/categories`,
      {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
        search: params.search,
      },
    );
  },

  getBrands: async (
    params: AppointmentListParams = {},
  ): Promise<AppointmentProvider[]> => {
    const response = await appointmentsDiscoveryService.getBrandsPage(params);
    return unwrapListResponse(response);
  },

  getBrandsPage: async (
    params: AppointmentListParams = {},
  ): Promise<AppointmentBrandsApiResponse> => {
    return await apiClient.get<AppointmentBrandsApiResponse>(
      '/api/v1/apps/general-bookings/discovery/brands',
      toBrandsQueryParams(params),
    );
  },

  getTopBrands: async (
    params: AppointmentTopBrandsParams = {},
  ): Promise<AppointmentTopBrand[]> => {
    const response = await apiClient.get<AppointmentTopBrandsApiResponse>(
      '/api/v1/apps/general-bookings/discovery/top-brands',
      toTopBrandsQueryParams(params),
    );

    return unwrapListResponse(response);
  },

  getNearbyProviders: async (
    params: AppointmentNearbyProvidersParams = {},
  ): Promise<AppointmentProvider[]> => {
    const response = await apiClient.get<AppointmentNearbyProvidersApiResponse>(
      '/api/v1/apps/general-bookings/discovery/nearby-stores',
      toNearbyProvidersQueryParams(params),
    );

    return unwrapListResponse(response);
  },

  getOrderAgain: async (
    params: AppointmentOrderAgainParams = {},
  ): Promise<AppointmentOrderAgainItem[]> => {
    const response = await apiClient.get<AppointmentOrderAgainApiResponse>(
      '/api/v1/apps/general-bookings/discovery/order-again',
      toOrderAgainQueryParams(params),
    );

    return unwrapListResponse(response);
  },

  getStoreView: async (
    storeId: string,
  ): Promise<AppointmentStoreViewApiResponse> =>
    apiClient.get<AppointmentStoreViewApiResponse>(
      `/api/v1/apps/general-bookings/service-centers/${storeId}/view`,
    ),

  getStoreServicesPage: async (
    params: AppointmentStoreServicesParams,
  ): Promise<AppointmentStoreServicesApiResponse> => {
    const { storeId, offset = 0, limit = 10, search, categoryId, subcategoryId } = params;

    return apiClient.get<AppointmentStoreServicesApiResponse>(
      `/api/v1/apps/general-bookings/service-centers/${storeId}/view/services`,
      {
        offset,
        limit,
        search,
        categoryId,
        subcategoryId,
      },
    );
  },
};
