import apiClient from '../../../general/api/apiClient';
import type {
  CheckoutScheduleSlotsInput,
  CheckoutScheduleSlotsResponse,
  CheckoutPreviewInput,
  CheckoutPreviewResponse,
  PlaceOrderInput,
  PlaceOrderResponse,
} from './orderServiceTypes';

const ORDERS_BASE = '/api/v1/apps/deliveries/orders';

export const orderService = {
  getCheckoutScheduleSlots: (
    storeId: string,
    input: CheckoutScheduleSlotsInput = {},
  ) =>
    apiClient.get<CheckoutScheduleSlotsResponse>(
      `${ORDERS_BASE}/schedule-slots/${storeId}`,
      input,
    ),

  getCheckoutPreview: (input: CheckoutPreviewInput) =>
    apiClient.get<CheckoutPreviewResponse>(
      `${ORDERS_BASE}/place-order/preview`,
      input,
    ),

  placeOrder: (input: PlaceOrderInput) =>
    apiClient.post<PlaceOrderResponse>(ORDERS_BASE, input),
};
