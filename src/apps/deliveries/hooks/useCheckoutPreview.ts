import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import { orderService } from '../api/orderService';
import type {
  CheckoutPreviewInput,
  CheckoutPreviewResponse,
} from '../api/orderServiceTypes';

type UseCheckoutPreviewOptions = Omit<
  UseQueryOptions<CheckoutPreviewResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

export function useCheckoutPreview(
  input: CheckoutPreviewInput | null,
  options?: UseCheckoutPreviewOptions,
) {
  return useQuery<CheckoutPreviewResponse, ApiError>({
    queryKey: input
      ? deliveryKeys.checkoutPreview(input)
      : [...deliveryKeys.all, 'checkout-preview', 'idle'],
    queryFn: () => {
      if (!input) {
        throw new Error('Checkout preview input is missing.');
      }

      return orderService.getCheckoutPreview(input);
    },
    enabled: Boolean(input),
    staleTime: 30 * 1000,
    ...options,
  });
}
