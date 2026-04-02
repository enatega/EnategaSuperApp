import type {
  InfiniteData,
  UseQueryOptions,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import type {
  ActiveOrdersResponse,
  DeliveryOrdersListParams,
  OrderDetailsResponse,
  PastOrdersResponse,
  ScheduledOrdersResponse,
} from '../api/ordersServiceTypes';
import { deliveryKeys } from '../api/queryKeys';

export type UseOrderListParams = Pick<DeliveryOrdersListParams, 'limit' | 'search'>;

export type UsePastOrdersOptions = Omit<
  UseInfiniteQueryOptions<
    PastOrdersResponse,
    ApiError,
    InfiniteData<PastOrdersResponse>,
    ReturnType<typeof deliveryKeys.pastOrders>,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export type UseActiveOrdersOptions = Omit<
  UseInfiniteQueryOptions<
    ActiveOrdersResponse,
    ApiError,
    InfiniteData<ActiveOrdersResponse>,
    ReturnType<typeof deliveryKeys.activeOrders>,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export type UseScheduledOrdersOptions = Omit<
  UseInfiniteQueryOptions<
    ScheduledOrdersResponse,
    ApiError,
    InfiniteData<ScheduledOrdersResponse>,
    ReturnType<typeof deliveryKeys.scheduledOrders>,
    number
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export type UseOrderDetailsOptions = Omit<
  UseQueryOptions<
    OrderDetailsResponse,
    ApiError,
    OrderDetailsResponse,
    ReturnType<typeof deliveryKeys.orderDetail>
  >,
  'queryKey' | 'queryFn'
>;
