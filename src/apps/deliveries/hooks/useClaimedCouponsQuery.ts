import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import {
  claimedCouponsService,
  type ClaimedCouponsResponse,
} from '../api/claimedCouponsService';

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 10;

export const claimedCouponsKeys = {
  all: ['deliveries-claimed-coupons'] as const,
  list: (offset: number, limit: number) =>
    [...claimedCouponsKeys.all, offset, limit] as const,
};

export function useClaimedCouponsQuery(
  offset = DEFAULT_OFFSET,
  limit = DEFAULT_LIMIT,
) {
  return useQuery<ClaimedCouponsResponse, ApiError>({
    queryKey: claimedCouponsKeys.list(offset, limit),
    queryFn: () => claimedCouponsService.getClaimedCoupons(offset, limit),
    staleTime: 60 * 1000,
  });
}
