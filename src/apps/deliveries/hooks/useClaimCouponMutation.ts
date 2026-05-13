import { useMutation } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import {
  claimCouponService,
  type ClaimCouponResponse,
} from '../api/claimCouponService';

type ClaimCouponVariables = {
  code: string;
};

export function useClaimCouponMutation() {
  return useMutation<ClaimCouponResponse, ApiError, ClaimCouponVariables>({
    mutationFn: (variables) => claimCouponService.claimCoupon(variables),
  });
}
