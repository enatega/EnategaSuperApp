import type { QueryClient } from '@tanstack/react-query';
import { deliveryKeys } from '../api/queryKeys';
import type { CartResponse } from '../api/cartServiceTypes';

export function syncCartQueries(queryClient: QueryClient, data: CartResponse) {
  queryClient.setQueryData(deliveryKeys.cart(), data);
  queryClient.setQueryData(deliveryKeys.cartCount(), {
    bucketId: data.bucketId,
    totalItems: data.totalItems,
    uniqueItems: data.uniqueItems,
    isEmpty: data.isEmpty,
  });
}
