import apiClient from "../../../general/api/apiClient";
import type {
  AppointmentPastBooking,
  AppointmentScheduledBooking,
  AppointmentScheduledBookingDetail,
  PaginatedAppointmentsResponse,
} from "./types";

type RawScheduledBooking = {
  order_id: string;
  store_name: string;
  store_image?: string | null;
  store_address?: string | null;
  store_latitude?: number | null;
  store_longitude?: number | null;
  date: string;
  order_status: string;
  order_price: number;
  item_count?: number;
  duration_minutes?: number;
};

type RawPastBooking = {
  orderId: string;
  storeId: string;
  storeName: string;
  storeImage?: string | null;
  storeLogo?: string | null;
  orderedAt: string;
  orderPrice: number;
  orderStatus: string;
};

type RawScheduledBookingDetail = {
  store_id: string;
  store_name: string;
  store_image?: string | null;
  store_address: string;
  store_latitude?: number | null;
  store_longitude?: number | null;
  order_status: string;
  scheduled_for: string;
  duration_minutes: number;
  cancellation_policy: string;
  can_cancel?: boolean;
  can_reschedule?: boolean;
  cancellation_cutoff_at?: string | null;
  is_completed: boolean;
  has_review: boolean;
  assigned_worker?: {
    id: string;
    name: string;
    image?: string | null;
  } | null;
  order_items: Array<{
    product_id: string;
    product_name: string;
    product_description?: string | null;
    product_image?: string | null;
    qty: number;
    product_price: number;
    original_product_price: number;
    duration_minutes: number;
    selected_options?: Array<{ groupId: string; optionId: string }>;
  }>;
  order_summary: {
    order_no: string;
    item_subtotal: number;
    service_fee: number;
    total_amount: number;
    payment_details: string;
  };
};

export interface AppointmentPastBookingsParams {
  offset?: number;
  limit?: number;
}

function mapScheduledBooking(
  item: RawScheduledBooking,
): AppointmentScheduledBooking {
  return {
    orderId: item.order_id,
    storeName: item.store_name,
    storeImage: item.store_image ?? null,
    storeAddress: item.store_address ?? null,
    storeLatitude: item.store_latitude ?? null,
    storeLongitude: item.store_longitude ?? null,
    scheduledAt: item.date,
    orderStatus: item.order_status,
    orderPrice: Number(item.order_price ?? 0),
    itemCount: Number(item.item_count ?? 0),
    durationMinutes: Number(item.duration_minutes ?? 0),
  };
}

function mapPastBooking(item: RawPastBooking): AppointmentPastBooking {
  return {
    orderId: item.orderId,
    storeId: item.storeId,
    storeName: item.storeName,
    storeImage: item.storeImage ?? null,
    storeLogo: item.storeLogo ?? null,
    orderedAt: item.orderedAt,
    orderPrice: Number(item.orderPrice ?? 0),
    orderStatus: item.orderStatus,
  };
}

export const appointmentBookingsService = {
  getScheduledBookings: async (): Promise<AppointmentScheduledBooking[]> => {
    const response = await apiClient.get<RawScheduledBooking[]>(
      "/api/v1/apps/general-bookings/orders/scheduled",
    );

    return Array.isArray(response) ? response.map(mapScheduledBooking) : [];
  },

  getScheduledBookingDetail: async (
    orderId: string,
  ): Promise<AppointmentScheduledBookingDetail> => {
    const response = await apiClient.get<RawScheduledBookingDetail>(
      `/api/v1/apps/general-bookings/orders/scheduled/${orderId}`,
    );

    return {
      storeId: response.store_id,
      storeName: response.store_name,
      storeImage: response.store_image ?? null,
      storeAddress: response.store_address,
      storeLatitude: response.store_latitude ?? null,
      storeLongitude: response.store_longitude ?? null,
      orderStatus: response.order_status,
      scheduledAt: response.scheduled_for,
      durationMinutes: Number(response.duration_minutes ?? 0),
      cancellationPolicy: response.cancellation_policy,
      canCancel: Boolean(response.can_cancel),
      canReschedule: Boolean(response.can_reschedule),
      cancellationCutoffAt: response.cancellation_cutoff_at ?? null,
      isCompleted: Boolean(response.is_completed),
      hasReview: Boolean(response.has_review),
      assignedWorker: response.assigned_worker
        ? {
            id: response.assigned_worker.id,
            name: response.assigned_worker.name,
            image: response.assigned_worker.image ?? null,
          }
        : null,
      selections: (response.order_items ?? []).map((item) => ({
        serviceId: item.product_id,
        selectedOptions: (item.selected_options ?? []).map((option) => ({
          groupId: option.groupId,
          optionId: option.optionId,
        })),
      })),
      items: (response.order_items ?? []).map((item) => ({
        name: item.product_name,
        description: item.product_description ?? null,
        image: item.product_image ?? null,
        quantity: Number(item.qty ?? 1),
        price: Number(item.product_price ?? 0),
        originalPrice: Number(
          item.original_product_price ?? item.product_price ?? 0,
        ),
        durationMinutes: Number(item.duration_minutes ?? 0),
      })),
      summary: {
        orderNumber: response.order_summary.order_no,
        subtotal: Number(response.order_summary.item_subtotal ?? 0),
        serviceFee: Number(response.order_summary.service_fee ?? 0),
        total: Number(response.order_summary.total_amount ?? 0),
        paymentMethod: response.order_summary.payment_details,
      },
    };
  },

  getPastBookings: async (
    params: AppointmentPastBookingsParams = {},
  ): Promise<PaginatedAppointmentsResponse<AppointmentPastBooking>> => {
    const { offset = 0, limit = 10 } = params;
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<RawPastBooking>
    >("/api/v1/apps/general-bookings/orders/past", { offset, limit });

    return {
      ...response,
      items: Array.isArray(response.items)
        ? response.items.map(mapPastBooking)
        : [],
    };
  },
};
