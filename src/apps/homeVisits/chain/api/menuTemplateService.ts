import apiClient from '../../../../general/api/apiClient';
import type {
  ChainMenuCategoriesApiResponse,
  ChainMenuCategoriesParams,
  ChainMenuCategoryServicesApiResponse,
  ChainMenuCategoryServicesParams,
  ChainMenuDealsApiResponse,
  ChainMenuDealsParams,
  ChainMenuTemplatesApiResponse,
  ChainMenuTemplatesParams,
} from './types';

const CHAIN_DISCOVERY_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

function toServiceQueryParams(
  params: ChainMenuCategoryServicesParams | ChainMenuDealsParams,
): Record<string, unknown> {
  const {
    offset = CHAIN_DISCOVERY_DEFAULTS.offset,
    limit = CHAIN_DISCOVERY_DEFAULTS.limit,
    search,
    latitude,
    longitude,
    stock = 'all',
    category_ids,
    subcategory_id,
    price_tiers,
    sort_by = 'recommended',
  } = params;

  return {
    offset,
    limit,
    search: search?.trim() || undefined,
    latitude,
    longitude,
    stock,
    category_ids,
    subcategory_id,
    price_tiers,
    sort_by,
  };
}

export const homeVisitsChainMenuTemplateService = {
  getMenuTemplatesPage: async (
    params: ChainMenuTemplatesParams = {},
  ): Promise<ChainMenuTemplatesApiResponse> => {
    const {
      offset = CHAIN_DISCOVERY_DEFAULTS.offset,
      limit = CHAIN_DISCOVERY_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<ChainMenuTemplatesApiResponse>(
        '/api/v1/apps/home-services/discovery/store-chain/menu-templates',
        { offset, limit },
      );
    } catch (error) {
      console.error('home visits chain menu templates request failed', error);
      throw error;
    }
  },

  getMenuCategoriesPage: async (
    params: ChainMenuCategoriesParams,
  ): Promise<ChainMenuCategoriesApiResponse> => {
    const {
      menuTemplateId,
      offset = CHAIN_DISCOVERY_DEFAULTS.offset,
      limit = CHAIN_DISCOVERY_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<ChainMenuCategoriesApiResponse>(
        `/api/v1/apps/home-services/discovery/store-chain/menus/${menuTemplateId}/categories`,
        { offset, limit },
      );
    } catch (error) {
      console.error('home visits chain menu categories request failed', error);
      throw error;
    }
  },

  getMenuCategoryServices: async (
    params: ChainMenuCategoryServicesParams,
  ) => {
    const response =
      await homeVisitsChainMenuTemplateService.getMenuCategoryServicesPage(
        params,
      );
    return response.items;
  },

  getMenuCategoryServicesPage: async (
    params: ChainMenuCategoryServicesParams,
  ): Promise<ChainMenuCategoryServicesApiResponse> => {
    const { categoryId, menuTemplateId } = params;

    try {
      return await apiClient.get<ChainMenuCategoryServicesApiResponse>(
        `/api/v1/apps/home-services/discovery/store-chain/menus/${menuTemplateId}/categories/${categoryId}/services`,
        toServiceQueryParams(params),
      );
    } catch (error) {
      console.error('home visits chain category services request failed', error);
      throw error;
    }
  },

  getDealsPage: async (
    params: ChainMenuDealsParams,
  ): Promise<ChainMenuDealsApiResponse> => {
    const { menuTemplateId, tab } = params;

    try {
      return await apiClient.get<ChainMenuDealsApiResponse>(
        `/api/v1/apps/home-services/discovery/store-chain/menus/${menuTemplateId}/deals`,
        {
          ...toServiceQueryParams(params),
          tab,
        },
      );
    } catch (error) {
      console.error('home visits chain deals request failed', error);
      throw error;
    }
  },
};
