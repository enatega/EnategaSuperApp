import { useMutation } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { useCouponService, type UseCouponResponse } from '../api/useCouponService';

type UseCouponVariables = {
  id: string;
  isActive: boolean;
};

export function useUseCouponMutation() {
  return useMutation<UseCouponResponse, ApiError, UseCouponVariables>({
    mutationFn: ({ id, isActive }) => useCouponService.useCoupon(id, { isActive }),
  });
}
