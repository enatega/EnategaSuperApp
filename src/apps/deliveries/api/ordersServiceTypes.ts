import type { PaginatedDeliveryResponse } from "./types";

export type DeliveryOrderStatus =
  | "scheduled"
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "rider_assigned"
  | "picked_up"
  | "out_for_delivery"
  | "arrived"
  | "delivered"
  | "cancelled"
  | "rejected"
  | "failed"
  | string;

export interface PastOrderItem {
  orderId: string;
  storeId: string;
  storeName: string;
  storeImage: string | null;
  storeLogo: string | null;
  orderedAt: string;
  orderPrice: number;
  orderStatus: DeliveryOrderStatus;
}

export interface PastOrdersParams {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface ActiveOrderStore {
  id: string;
  name: string;
  address: string | null;
  estimatedDeliveryTime: string | number | null;
  image: string | null;
  logo: string | null;
}

export interface ActiveOrderDeliveryDetails {
  label: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  storeLatitude: number | null;
  storeLongitude: number | null;
}

export interface ActiveOrderRider {
  id?: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: unknown;
}

export interface ActiveOrderProduct {
  id?: string;
  productId?: string;
  name?: string | null;
  quantity?: number | null;
  image?: string | null;
  price?: number | null;
  unitPrice?: number | null;
  totalPrice?: number | null;
  note?: string | null;
  description?: string | null;
  specialInstructions?: string | null;
  addons?: Array<ActiveOrderProductAddon | string> | null;
  addOns?: Array<ActiveOrderProductAddon | string> | null;
  modifiers?: Array<ActiveOrderProductAddon | string> | null;
  options?: Array<ActiveOrderProductAddon | string> | null;
  customizations?: Array<ActiveOrderProductAddon | string> | null;
  [key: string]: unknown;
}

export interface ActiveOrderProductAddon {
  id?: string;
  name?: string | null;
  title?: string | null;
  label?: string | null;
  value?: string | null;
  quantity?: number | null;
  price?: number | null;
  [key: string]: unknown;
}

export interface ActiveOrderItems {
  summaryLabel: string;
  additionalItemsCount: number;
  previewImages: string[];
  products: ActiveOrderProduct[];
}

export interface ActiveOrderSummary {
  orderNumber: string;
  itemSubtotal: number;
  discountAmount: number;
  taxAmount: number;
  packingCharges: number;
  deliveryFee: number;
  courierTip: number;
  deliveryDistanceKm: number | null;
  couponCode: string | null;
  totalAmount: number;
  note: string | null;
}

export interface ActiveOrderTimelineItem {
  key: string;
  title: string;
  completedAt: string | null;
  completed: boolean;
  active: boolean;
}

export interface OrderDetailsResponse {
  orderId: string;
  status: DeliveryOrderStatus;
  statusTitle: string;
  statusMessage: string;
  orderType: string;
  paymentMethod: string;
  paymentStatus: string;
  orderedAt: string;
  scheduledAt: string | null;
  store: ActiveOrderStore;
  deliveryDetails: ActiveOrderDeliveryDetails;
  rider: ActiveOrderRider | null;
  orderItems: ActiveOrderItems;
  summary: ActiveOrderSummary;
  timeline: ActiveOrderTimelineItem[];
}

export type PastOrdersResponse = PaginatedDeliveryResponse<PastOrderItem>;
export type ActiveOrdersResponse = PaginatedDeliveryResponse<PastOrderItem>;
export type ScheduledOrdersResponse = PaginatedDeliveryResponse<PastOrderItem>;
