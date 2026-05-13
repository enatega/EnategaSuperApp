import apiClient from '../../../general/api/apiClient';

type ClaimCouponPayload = {
  code: string;
};

export type ClaimCouponResponse = {
  error?: string;
  message: string;
  statusCode?: number;
};

const CLAIM_COUPON_PATH = '/api/v1/apps/deliveries/customer-coupons/claim';

export const claimCouponService = {
  claimCoupon: (payload: ClaimCouponPayload) =>
    apiClient.post<ClaimCouponResponse>(CLAIM_COUPON_PATH, payload),
};
