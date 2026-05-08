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
const CHECKOUT_PREVIEW_PATH = `${ORDERS_BASE}/place-order/preview`;
const CHECKOUT_PLACE_ORDER_PATH = ORDERS_BASE;
const ENABLE_DELIVERIES_ORDER_DEBUG = true;

export const orderService = {
  getCheckoutScheduleSlots: (
    storeId: string,
    input: CheckoutScheduleSlotsInput = {},
  ) =>
    apiClient.get<CheckoutScheduleSlotsResponse>(
      `${ORDERS_BASE}/schedule-slots/${storeId}`,
      input,
    ),

  getCheckoutPreview: async (input: CheckoutPreviewInput) => {
    if (ENABLE_DELIVERIES_ORDER_DEBUG) {
      console.log('[Deliveries][OrderService][Request]', {
        api: CHECKOUT_PREVIEW_PATH,
        input,
        method: 'GET',
      });
    }

    const response = await apiClient.get<CheckoutPreviewResponse>(
      CHECKOUT_PREVIEW_PATH,
      input,
    ).catch((error) => {
      if (ENABLE_DELIVERIES_ORDER_DEBUG) {
        console.log('[Deliveries][OrderService][Error]', {
          api: CHECKOUT_PREVIEW_PATH,
          error,
        });
      }
    });

    if (ENABLE_DELIVERIES_ORDER_DEBUG) {
      console.log('[Deliveries][OrderService][Response]', {
        api: CHECKOUT_PREVIEW_PATH,
        response,
      });
    }

    return response;
  },

  placeOrder: async (input: PlaceOrderInput) => {
    if (ENABLE_DELIVERIES_ORDER_DEBUG) {
      console.log('[Deliveries][OrderService][PlaceOrder][Request]', {
        api: CHECKOUT_PLACE_ORDER_PATH,
        input,
        method: 'POST',
      });
    }

    const response = await apiClient.post<PlaceOrderResponse>(ORDERS_BASE, input);

    if (ENABLE_DELIVERIES_ORDER_DEBUG) {
      console.log('[Deliveries][OrderService][PlaceOrder][Response]', {
        api: CHECKOUT_PLACE_ORDER_PATH,
        response,
      });
    }

    return response;
  },
};
