import apiClient from '../../../general/api/apiClient';

export type ClaimedCouponApiItem = {
  claimed_at: string;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FIXED' | 'FLAT';
  discount_value: number;
  end_date: string;
  id: string;
  is_active: boolean;
  max_discount_cap: number;
  min_order_value: number;
  name: string;
  offered_by:
  | Array<{
    store_user_image: string;
    store_id: string;
    store_image: string;
    store_name: string;
  }>
  | null;
  start_date: string;
  status: string;
};

export type ClaimedCouponsResponse = {
  data: ClaimedCouponApiItem[];
  limit: number;
  offset: number;
  total: number;
};

const CLAIMED_COUPONS_PATH = '/api/v1/apps/deliveries/customer-coupons/claimed';

export const claimedCouponsService = {
  getClaimedCoupons: (offset: number, limit: number) =>
    apiClient.get<ClaimedCouponsResponse>(CLAIMED_COUPONS_PATH, {
      limit,
      offset,
    }),
};
