import { ordersService } from '../../api/ordersService';

export const CHECKOUT_STRIPE_SUCCESS_URL =
  'https://checkout.enatega.app/deliveries/stripe/success';
export const CHECKOUT_STRIPE_CANCEL_URL =
  'https://checkout.enatega.app/deliveries/stripe/cancel';
export const CHECKOUT_STRIPE_SUCCESS_MATCHER = '/success';
export const CHECKOUT_STRIPE_CANCEL_MATCHER = '/cancel';

export async function getLatestStripeCheckoutOrderId(
  isScheduledOrder: boolean,
) {
  const primaryResponse = isScheduledOrder
    ? await ordersService.getScheduledOrders({ limit: 1, offset: 0 })
    : await ordersService.getActiveOrders({ limit: 1, offset: 0 });

  const primaryOrderId = primaryResponse.items[0]?.orderId;

  if (primaryOrderId) {
    return primaryOrderId;
  }

  const fallbackResponse = isScheduledOrder
    ? await ordersService.getActiveOrders({ limit: 1, offset: 0 })
    : await ordersService.getScheduledOrders({ limit: 1, offset: 0 });

  return fallbackResponse.items[0]?.orderId ?? null;
}
