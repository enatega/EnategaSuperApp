import apiClient from '../../../../general/api/apiClient';
import type {
  ChainMenuCategoriesApiResponse,
  ChainMenuCategoriesParams,
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
};
