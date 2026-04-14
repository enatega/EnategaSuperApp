import type {
  DeliveryShopTypeProduct,
  PaginatedDeliveryResponse,
} from '../../api/types';

export type ChainMenuTemplate = {
  id: string;
  name: string;
};

export type ChainMenuCategory = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

export type ChainMenuTemplatesParams = {
  offset?: number;
  limit?: number;
};

export type ChainMenuCategoriesParams = {
  menuTemplateId: string;
  offset?: number;
  limit?: number;
};

export type ChainMenuCategoryProductsParams = {
  menuTemplateId: string;
  categoryId: string;
  offset?: number;
  limit?: number;
  search?: string;
  stock?: string;
  subcategory_id?: string;
  price_tiers?: string[];
  sort_by?: string;
};

export type ChainMenuDealsParams = {
  menuTemplateId: string;
  offset?: number;
  limit?: number;
  search?: string;
  tab?: string;
  sort_by?: string;
};

export type ChainMenuTemplatesApiResponse =
  PaginatedDeliveryResponse<ChainMenuTemplate>;

export type ChainMenuCategoriesApiResponse =
  PaginatedDeliveryResponse<ChainMenuCategory>;

export type ChainMenuCategoryProductsApiResponse =
  PaginatedDeliveryResponse<DeliveryShopTypeProduct>;

export type ChainMenuDealsApiResponse =
  PaginatedDeliveryResponse<DeliveryShopTypeProduct>;
