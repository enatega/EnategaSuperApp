import type { ApiResponse, PaginatedDeliveryResponse } from './types';

export type DeliveryDealsTabType = 'all' | 'limited' | 'weekly';

export interface DeliveryDealItem {
  dealId: string;
  id: string;
  name: string;
  imageUrl?: string | null;
  price?: number | null;
  deal?: string | null;
  dealType?: string | null;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  savings?: number | null;
  discountType?: string | null;
  discountValue?: number | null;
  variationId?: string | null;
  variationName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  endsInSeconds?: number | null;
  tabType?: string | null;
}

export interface DeliveryDealsListingParams {
  offset?: number;
  limit?: number;
  search?: string;
  tab?: DeliveryDealsTabType;
  category_ids?: string[];
  subcategory_id?: string;
  price_tiers?: string[];
  latitude?: number;
  longitude?: number;
  sort_by?: string;
}

export type DeliveryDealsListingApiResponse =
  | ApiResponse<DeliveryDealItem[]>
  | PaginatedDeliveryResponse<DeliveryDealItem>
  | DeliveryDealItem[];
