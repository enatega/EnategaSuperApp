import apiClient from '../../../general/api/apiClient';

export type UseCouponPayload = {
  isActive: boolean;
};

export type UseCouponResponse = {
  message: string;
};

export const useCouponService = {
  useCoupon: (id: string, payload: UseCouponPayload) =>
    apiClient.post<UseCouponResponse>(
      `/api/v1/apps/deliveries/customer-coupons/use/${id}`,
      payload,
    ),
};
