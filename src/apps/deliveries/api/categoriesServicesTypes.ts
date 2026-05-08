import type { ApiResponse, PaginatedDeliveryResponse } from './types';

export interface DeliveryShopTypeCategory {
  id: string;
  name: string;
  imageUrl?: string | null;
}

export interface DeliveryShopTypeCategoriesParams {
  shopTypeId: string;
  offset?: number;
  limit?: number;
}

export type DeliveryShopTypeCategoriesApiResponse =
  | ApiResponse<DeliveryShopTypeCategory[]>
  | PaginatedDeliveryResponse<DeliveryShopTypeCategory>
  | DeliveryShopTypeCategory[];
