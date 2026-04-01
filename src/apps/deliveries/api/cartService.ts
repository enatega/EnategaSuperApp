import apiClient from '../../../general/api/apiClient';
import type {
  AddCartItemInput,
  CartCountResponse,
  CartResponse,
  UpdateCartItemQuantityInput,
} from './cartServiceTypes';

const CART_BASE = '/api/v1/apps/deliveries/buckets/cart';

export const cartService = {
  getCart: () => apiClient.get<CartResponse>(CART_BASE),
  getCartCount: () => apiClient.get<CartCountResponse>(`${CART_BASE}/count`),
  addItem: (input: AddCartItemInput) =>
    apiClient.post<CartResponse>(`${CART_BASE}/items`, input),
  updateItemQuantity: (itemId: string, input: UpdateCartItemQuantityInput) =>
    apiClient.patch<CartResponse>(`${CART_BASE}/items/${itemId}/quantity`, input),
  incrementItem: (itemId: string) =>
    apiClient.post<CartResponse>(`${CART_BASE}/items/${itemId}/increment`),
  decrementItem: (itemId: string) =>
    apiClient.post<CartResponse>(`${CART_BASE}/items/${itemId}/decrement`),
  removeItem: (itemId: string) =>
    apiClient.delete<CartResponse>(`${CART_BASE}/items/${itemId}`),
  clearCart: () => apiClient.delete<CartResponse>(CART_BASE),
};
