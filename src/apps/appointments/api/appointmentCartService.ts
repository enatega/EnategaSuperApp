import apiClient from "../../../general/api/apiClient";
import type {
  AppointmentCartCountResponse,
  AppointmentCartResponse,
  AppointmentCartSyncRequest,
} from "./types";

const CART_BASE = "/api/v1/apps/general-bookings/buckets/cart";

export const appointmentCartService = {
  getCart: () => apiClient.get<AppointmentCartResponse>(CART_BASE),
  getCartCount: () =>
    apiClient.get<AppointmentCartCountResponse>(`${CART_BASE}/count`),
  syncCart: (input: AppointmentCartSyncRequest) =>
    apiClient.put<AppointmentCartResponse>(CART_BASE, input),
  removeItem: (itemId: string) =>
    apiClient.delete<AppointmentCartResponse>(`${CART_BASE}/items/${itemId}`),
  clearCart: () => apiClient.delete<AppointmentCartResponse>(CART_BASE),
};
