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

export interface DeliveryOrderListItem {
  orderId: string;
  storeId: string;
  storeName: string;
  storeImage: string | null;
  storeLogo: string | null;
  orderedAt: string;
  orderPrice: number;
  orderStatus: DeliveryOrderStatus;
}

export interface DeliveryOrdersListParams {
  offset?: number;
  limit?: number;
  search?: string;
}

export interface DeliveryOrderStore {
  id: string;
  name: string;
  address: string | null;
  estimatedDeliveryTime: string | number | null;
  image: string | null;
  logo: string | null;
}

export interface DeliveryOrderDeliveryDetails {
  label: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  storeLatitude: number | null;
  storeLongitude: number | null;
}

export interface DeliveryOrderRider {
  id?: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  [key: string]: unknown;
}

export interface DeliveryOrderProduct {
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
  addons?: Array<DeliveryOrderProductAddon | string> | null;
  addOns?: Array<DeliveryOrderProductAddon | string> | null;
  modifiers?: Array<DeliveryOrderProductAddon | string> | null;
  options?: Array<DeliveryOrderProductAddon | string> | null;
  customizations?: Array<DeliveryOrderProductAddon | string> | null;
  selectedOptions?: Array<DeliveryOrderProductAddon | string> | null;
  [key: string]: unknown;
}

export interface DeliveryOrderProductAddon {
  id?: string;
  name?: string | null;
  title?: string | null;
  label?: string | null;
  value?: string | null;
  groupName?: string | null;
  optionName?: string | null;
  quantity?: number | null;
  price?: number | null;
  [key: string]: unknown;
}

export interface DeliveryOrderItems {
  summaryLabel: string;
  additionalItemsCount: number;
  previewImages: string[];
  products: DeliveryOrderProduct[];
}

export interface DeliveryOrderSummary {
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

export interface DeliveryOrderTimelineItem {
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
  store: DeliveryOrderStore;
  deliveryDetails: DeliveryOrderDeliveryDetails;
  rider: DeliveryOrderRider | null;
  orderItems: DeliveryOrderItems;
  summary: DeliveryOrderSummary;
  timeline: DeliveryOrderTimelineItem[];
}

export type ActiveOrdersResponse = PaginatedDeliveryResponse<DeliveryOrderListItem>;
export type PastOrdersResponse = PaginatedDeliveryResponse<DeliveryOrderListItem>;
export type ScheduledOrdersResponse = PaginatedDeliveryResponse<DeliveryOrderListItem>;
