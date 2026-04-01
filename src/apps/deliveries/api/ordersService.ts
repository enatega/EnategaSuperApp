import apiClient from "../../../general/api/apiClient";
import type {
  ActiveOrdersResponse,
  OrderDetailsResponse,
  PastOrdersParams,
  PastOrdersResponse,
  ScheduledOrdersResponse,
} from "./ordersServiceTypes";

const ORDERS_BASE = "/api/v1/apps/deliveries/orders";

export const ordersService = {
  getActiveOrders: (
    params: PastOrdersParams = {},
  ): Promise<ActiveOrdersResponse> =>
    apiClient.get<ActiveOrdersResponse>(ORDERS_BASE, {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10,
      search: params.search,
    }),

  getPastOrders: (params: PastOrdersParams = {}): Promise<PastOrdersResponse> =>
    apiClient.get<PastOrdersResponse>(`${ORDERS_BASE}/past`, {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10,
      search: params.search,
    }),

  getScheduledOrders: (
    params: PastOrdersParams = {},
  ): Promise<ScheduledOrdersResponse> =>
    apiClient.get<ScheduledOrdersResponse>(`${ORDERS_BASE}/scheduled`, {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10,
      search: params.search,
    }),

  getOrderDetails: (orderId: string): Promise<OrderDetailsResponse> =>
    apiClient.get<OrderDetailsResponse>(`${ORDERS_BASE}/${orderId}`),
};
