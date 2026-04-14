import apiClient from '../../../../general/api/apiClient';
import type {
  ChainMenuCategoriesApiResponse,
  ChainMenuCategoriesParams,
  ChainMenuDealsApiResponse,
  ChainMenuDealsParams,
  ChainMenuCategoryProductsApiResponse,
  ChainMenuCategoryProductsParams,
  ChainMenuTemplatesApiResponse,
  ChainMenuTemplatesParams,
} from './types';

const CHAIN_MENU_TEMPLATES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const CHAIN_MENU_CATEGORIES_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const CHAIN_MENU_CATEGORY_PRODUCTS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

const CHAIN_MENU_DEALS_DEFAULTS = {
  offset: 0,
  limit: 10,
} as const;

export const chainMenuTemplateService = {
  getMenuTemplatesPage: async (
    params: ChainMenuTemplatesParams = {},
  ): Promise<ChainMenuTemplatesApiResponse> => {
    const {
      offset = CHAIN_MENU_TEMPLATES_DEFAULTS.offset,
      limit = CHAIN_MENU_TEMPLATES_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<ChainMenuTemplatesApiResponse>(
        '/api/v1/apps/deliveries/discovery/store-chain/menu-templates',
        { offset, limit },
      );
    } catch (error) {
      console.error('chain menu templates request failed', error);
      throw error;
    }
  },

  getMenuCategoriesPage: async (
    params: ChainMenuCategoriesParams,
  ): Promise<ChainMenuCategoriesApiResponse> => {
    const {
      menuTemplateId,
      offset = CHAIN_MENU_CATEGORIES_DEFAULTS.offset,
      limit = CHAIN_MENU_CATEGORIES_DEFAULTS.limit,
    } = params;

    try {
      return await apiClient.get<ChainMenuCategoriesApiResponse>(
        `/api/v1/apps/deliveries/discovery/store-chain/menus/${menuTemplateId}/categories`,
        { offset, limit },
      );
    } catch (error) {
      console.error('chain menu categories request failed', error);
      throw error;
    }
  },

  getMenuCategoryProducts: async (params: ChainMenuCategoryProductsParams) => {
    const response =
      await chainMenuTemplateService.getMenuCategoryProductsPage(params);
    return response.items;
  },

  getMenuCategoryProductsPage: async (
    params: ChainMenuCategoryProductsParams,
  ): Promise<ChainMenuCategoryProductsApiResponse> => {
    const {
      menuTemplateId,
      categoryId,
      offset = CHAIN_MENU_CATEGORY_PRODUCTS_DEFAULTS.offset,
      limit = CHAIN_MENU_CATEGORY_PRODUCTS_DEFAULTS.limit,
      search,
    } = params;

    try {
      return await apiClient.get<ChainMenuCategoryProductsApiResponse>(
        `/api/v1/apps/deliveries/discovery/store-chain/menus/${menuTemplateId}/categories/${categoryId}/products`,
        {
          offset,
          limit,
          search: search?.trim() || undefined,
        },
      );
    } catch (error) {
      console.error('chain menu category products request failed', error);
      throw error;
    }
  },

  getDeals: async (params: ChainMenuDealsParams) => {
    const response = await chainMenuTemplateService.getDealsPage(params);
    return response.items;
  },

  getDealsPage: async (
    params: ChainMenuDealsParams,
  ): Promise<ChainMenuDealsApiResponse> => {
    const {
      menuTemplateId,
      offset = CHAIN_MENU_DEALS_DEFAULTS.offset,
      limit = CHAIN_MENU_DEALS_DEFAULTS.limit,
      search,
      tab,
      sort_by,
    } = params;

    try {
      return await apiClient.get<ChainMenuDealsApiResponse>(
        `/api/v1/apps/deliveries/discovery/store-chain/menus/${menuTemplateId}/deals`,
        {
          offset,
          limit,
          search: search?.trim() || undefined,
          tab,
          sort_by,
        },
      );
    } catch (error) {
      console.error('chain menu deals request failed', error);
      throw error;
    }
  },
};
