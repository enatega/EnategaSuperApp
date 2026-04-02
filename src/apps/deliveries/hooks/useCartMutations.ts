import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { cartService } from '../api/cartService';
import type {
  AddCartItemInput,
  CartResponse,
  UpdateCartItemQuantityInput,
} from '../api/cartServiceTypes';
import { syncCartQueries } from '../cart/cartQuerySync';

type Options = {
  onError?: (error: ApiError) => void;
};

export function useIncrementCartItemMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiError, string>({
    mutationFn: cartService.incrementItem,
    onSuccess: (data) => {
      syncCartQueries(queryClient, data);
    },
    onError: options?.onError,
  });
}

type UpdateQuantityVariables = {
  itemId: string;
  input: UpdateCartItemQuantityInput;
};

export function useAddCartItemMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiError, AddCartItemInput>({
    mutationFn: cartService.addItem,
    onSuccess: (data) => {
      syncCartQueries(queryClient, data);
    },
    onError: options?.onError,
  });
}

export function useUpdateCartItemQuantityMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiError, UpdateQuantityVariables>({
    mutationFn: ({ itemId, input }) => cartService.updateItemQuantity(itemId, input),
    onSuccess: (data) => {
      syncCartQueries(queryClient, data);
    },
    onError: options?.onError,
  });
}

export function useDecrementCartItemMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiError, string>({
    mutationFn: cartService.decrementItem,
    onSuccess: (data) => {
      syncCartQueries(queryClient, data);
    },
    onError: options?.onError,
  });
}

export function useRemoveCartItemMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiError, string>({
    mutationFn: cartService.removeItem,
    onSuccess: (data) => {
      syncCartQueries(queryClient, data);
    },
    onError: options?.onError,
  });
}

export function useClearCartMutation(options?: Options) {
  const queryClient = useQueryClient();

  return useMutation<CartResponse, ApiError, void>({
    mutationFn: cartService.clearCart,
    onSuccess: (data) => {
      syncCartQueries(queryClient, data);
    },
    onError: options?.onError,
  });
}
