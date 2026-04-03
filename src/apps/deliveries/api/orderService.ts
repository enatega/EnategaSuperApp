import apiClient from '../../../general/api/apiClient';
import type {
  CheckoutPreviewInput,
  CheckoutPreviewResponse,
} from './orderServiceTypes';

const ORDERS_BASE = '/api/v1/apps/deliveries/orders';

export const orderService = {
  getCheckoutPreview: (input: CheckoutPreviewInput) =>
    apiClient.get<CheckoutPreviewResponse>(
      `${ORDERS_BASE}/place-order/preview`,
      input,
    ),
};
