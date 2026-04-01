import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import type { ApiError } from "../../../general/api/apiClient";
import { deliveryKeys } from "../api/queryKeys";
import { ordersService } from "../api/ordersService";
import type {
  ActiveOrdersResponse,
  OrderDetailsResponse,
  PastOrdersResponse,
  ScheduledOrdersResponse,
} from "../api/ordersServiceTypes";
import type {
  UseActiveOrdersOptions,
  UseOrderDetailsOptions,
  UsePastOrdersOptions,
  UsePastOrdersParams,
  UseScheduledOrdersOptions,
} from "./useOrdersTypes";

const DEFAULT_ORDERS_LIMIT = 10;

export function useActiveOrders(
  params?: UsePastOrdersParams,
  options?: UseActiveOrdersOptions,
) {
  const limit = params?.limit ?? DEFAULT_ORDERS_LIMIT;
  const search = params?.search?.trim() || undefined;

  return useInfiniteQuery<
    ActiveOrdersResponse,
    ApiError,
    InfiniteData<ActiveOrdersResponse>,
    ReturnType<typeof deliveryKeys.activeOrders>,
    number
  >({
    queryKey: deliveryKeys.activeOrders({ limit, search }),
    queryFn: ({ pageParam }) =>
      ordersService.getActiveOrders({
        offset: pageParam,
        limit,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function usePastOrders(
  params?: UsePastOrdersParams,
  options?: UsePastOrdersOptions,
) {
  const limit = params?.limit ?? DEFAULT_ORDERS_LIMIT;
  const search = params?.search?.trim() || undefined;

  return useInfiniteQuery<
    PastOrdersResponse,
    ApiError,
    InfiniteData<PastOrdersResponse>,
    ReturnType<typeof deliveryKeys.pastOrders>,
    number
  >({
    queryKey: deliveryKeys.pastOrders({ limit, search }),
    queryFn: ({ pageParam }) =>
      ordersService.getPastOrders({
        offset: pageParam,
        limit,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useScheduledOrders(
  params?: UsePastOrdersParams,
  options?: UseScheduledOrdersOptions,
) {
  const limit = params?.limit ?? DEFAULT_ORDERS_LIMIT;
  const search = params?.search?.trim() || undefined;

  return useInfiniteQuery<
    ScheduledOrdersResponse,
    ApiError,
    InfiniteData<ScheduledOrdersResponse>,
    ReturnType<typeof deliveryKeys.scheduledOrders>,
    number
  >({
    queryKey: deliveryKeys.scheduledOrders({ limit, search }),
    queryFn: ({ pageParam }) =>
      ordersService.getScheduledOrders({
        offset: pageParam,
        limit,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useOrderDetails(
  orderId?: string,
  options?: UseOrderDetailsOptions,
) {
  return useQuery<
    OrderDetailsResponse,
    ApiError,
    OrderDetailsResponse,
    ReturnType<typeof deliveryKeys.orderDetail>
  >({
    queryKey: deliveryKeys.orderDetail(orderId ?? "unknown"),
    queryFn: () => ordersService.getOrderDetails(orderId ?? ""),
    enabled: Boolean(orderId) && (options?.enabled ?? true),
    staleTime: 30 * 1000,
    ...options,
  });
}
