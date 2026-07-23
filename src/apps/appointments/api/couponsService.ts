import apiClient from '../../../general/api/apiClient';

export type AppointmentCoupon = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  max_discount_cap: number | null;
  min_order_value: number;
  start_date: string;
  end_date: string;
};

export type AppointmentCouponsResponse = {
  data: AppointmentCoupon[];
  total: number;
  offset: number;
  limit: number;
};

const BASE = '/api/v1/apps/general-bookings/customer-coupons';

export const appointmentCouponsService = {
  getAvailable: () =>
    apiClient.get<AppointmentCouponsResponse>(`${BASE}/get-all`, {
      params: { limit: 50, offset: 0 },
    }),
};
