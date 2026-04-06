export type CheckoutOrderType = 'delivery' | 'pickup';

export type CheckoutPaymentMethod = 'cod' | 'stripe';

export type CheckoutPreviewInput = {
  storeId: string;
  bucketId: string;
  orderType: CheckoutOrderType;
  addressId?: string;
  scheduledAt?: string;
  riderTip?: number;
};

export type CheckoutScheduleSlotsInput = {
  dateTime?: string;
  days?: number;
  slotMinutes?: number;
};

export type CheckoutScheduleApiSlot = {
  start: string;
  end: string;
  isAvailable?: boolean;
  maxOrders?: number;
};

export type CheckoutScheduleApiDay = {
  date: string;
  label: string;
  dayName: string;
  isActive: boolean;
  hasSlots: boolean;
  slots: CheckoutScheduleApiSlot[];
};

export type CheckoutScheduleSlotsResponse = {
  allowScheduleBooking: boolean;
  selectedDate: string;
  days: CheckoutScheduleApiDay[];
  slots: CheckoutScheduleApiSlot[];
};

export type CheckoutPreviewStore = {
  id: string;
  name: string;
  address: string | null;
  image: string | null;
  logo: string | null;
  pickupAllowed: boolean;
  deliveryAllowed: boolean;
  scheduleAllowed: boolean;
  codAllowed: boolean;
  stripeAllowed: boolean;
};

export type CheckoutPreviewPickup = {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type CheckoutPreviewDelivery = {
  addressId: string;
  label: string | null;
  address: string;
  latitude: number;
  longitude: number;
};

export type CheckoutPreviewPricing = {
  subtotal: number;
  discount: number;
  tax: number;
  packingCharges: number;
  deliveryFee: number;
  riderTip: number;
  totalAmount: number;
};

export type CheckoutPreviewBucketItem = Record<string, unknown>;

export type CheckoutPreviewResponse = {
  store: CheckoutPreviewStore;
  fulfillment: {
    orderType: CheckoutOrderType;
    pickup: CheckoutPreviewPickup | null;
    delivery: CheckoutPreviewDelivery | null;
  };
  schedule: {
    isScheduled: boolean;
    scheduledAt: string | null;
    scheduleAllowed: boolean;
  };
  pricing: CheckoutPreviewPricing;
  bucket: {
    itemCount: number;
    items: CheckoutPreviewBucketItem[];
  };
};

export type PlaceOrderInput = {
  storeId: string;
  bucketId: string;
  orderType: CheckoutOrderType;
  paymentMethod: CheckoutPaymentMethod;
  addressId?: string;
  customerNote?: string;
  riderTip?: number;
  scheduledAt?: string;
};

export type PlaceOrderResponse = {
  mode: CheckoutPaymentMethod;
  orderId: string;
  status: string;
  paymentStatus: string;
  paymentMethod: 'cash' | 'card';
  orderType: CheckoutOrderType;
  totalAmount: number;
  scheduledAt: string | null;
  createdAt: string;
};
