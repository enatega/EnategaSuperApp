import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import { orderService } from '../api/orderService';
import type {
  CheckoutScheduleSlotsInput,
  CheckoutScheduleSlotsResponse,
} from '../api/orderServiceTypes';

type UseCheckoutScheduleOptions = Omit<
  UseQueryOptions<CheckoutScheduleSlotsResponse, ApiError>,
  'queryFn' | 'queryKey'
>;

export function useCheckoutSchedule(
  storeId: string | null,
  input: CheckoutScheduleSlotsInput,
  options?: UseCheckoutScheduleOptions,
) {
  return useQuery<CheckoutScheduleSlotsResponse, ApiError>({
    queryKey: storeId
      ? deliveryKeys.checkoutSchedule(storeId, input)
      : [...deliveryKeys.all, 'checkout-schedule', 'idle'],
    queryFn: () => {
      if (!storeId) {
        throw new Error('Store ID is missing.');
      }

      return orderService.getCheckoutScheduleSlots(storeId, input);
    },
    enabled: Boolean(storeId),
    staleTime: 30 * 1000,
    ...options,
  });
}
