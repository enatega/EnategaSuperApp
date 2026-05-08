import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import { orderService } from '../api/orderService';
import type {
  PlaceOrderInput,
  PlaceOrderResponse,
} from '../api/orderServiceTypes';

type Options = {
  onError?: (error: ApiError) => void;
  onSuccess?: (data: PlaceOrderResponse) => void;
};

const ENABLE_PLACE_ORDER_DEBUG_LOGS = true;

export function usePlaceOrder(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<PlaceOrderResponse, ApiError, PlaceOrderInput>({
    mutationFn: orderService.placeOrder,
    onMutate: (variables) => {
      if (ENABLE_PLACE_ORDER_DEBUG_LOGS) {
        console.log('[Deliveries][usePlaceOrder][Payload]', variables);
      }
    },
    onSuccess: (data) => {
      if (ENABLE_PLACE_ORDER_DEBUG_LOGS) {
        console.log('[Deliveries][usePlaceOrder][Success]', data);
      }
      options?.onSuccess?.(data);

      if (data.mode === 'stripe') {
        return;
      }

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: deliveryKeys.cart() }),
        queryClient.invalidateQueries({ queryKey: deliveryKeys.cartCount() }),
        queryClient.invalidateQueries({ queryKey: deliveryKeys.orders() }),
      ]);
    },
    onError: (error) => {
      if (ENABLE_PLACE_ORDER_DEBUG_LOGS) {
        console.log('[Deliveries][usePlaceOrder][Error]', error);
      }
      options?.onError?.(error);
    },
  });
}
