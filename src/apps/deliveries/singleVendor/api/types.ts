import type {
  DeliveryShopTypeProduct,
  PaginatedDeliveryResponse,
} from '../../api/types';

export interface SingleVendorCategory {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface SingleVendorCategoriesParams {
  offset?: number;
  limit?: number;
}

export interface SingleVendorCategoryProductsParams {
  categoryId: string;
  offset?: number;
  limit?: number;
}

export type SingleVendorCategoriesApiResponse =
  PaginatedDeliveryResponse<SingleVendorCategory>;

export type SingleVendorCategoryProductsApiResponse =
  PaginatedDeliveryResponse<DeliveryShopTypeProduct>;
