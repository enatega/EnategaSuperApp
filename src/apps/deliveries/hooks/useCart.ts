import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { deliveryKeys } from '../api/queryKeys';
import { cartService } from '../api/cartService';
import type { CartCountResponse, CartResponse } from '../api/cartServiceTypes';

type UseCartOptions = Omit<
  UseQueryOptions<CartResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

type UseCartCountOptions = Omit<
  UseQueryOptions<CartCountResponse, ApiError>,
  'queryKey' | 'queryFn'
>;

export function useCart(options?: UseCartOptions) {
  return useQuery<CartResponse, ApiError>({
    queryKey: deliveryKeys.cart(),
    queryFn: cartService.getCart,
    staleTime: 30 * 1000,
    ...options,
  });
}

export function useCartCount(options?: UseCartCountOptions) {
  return useQuery<CartCountResponse, ApiError>({
    queryKey: deliveryKeys.cartCount(),
    queryFn: cartService.getCartCount,
    staleTime: 30 * 1000,
    ...options,
  });
}
