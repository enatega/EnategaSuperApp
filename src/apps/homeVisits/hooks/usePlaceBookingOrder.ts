import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../singleVendor/api/discoveryService';
import type {
  HomeVisitsServiceOrderPreviewPayload,
  HomeVisitsServicePlaceOrderResponse,
} from '../singleVendor/api/types';

type UsePlaceBookingOrderOptions = {
  onError?: (error: ApiError) => void;
  onSuccess?: (data: HomeVisitsServicePlaceOrderResponse) => void;
};

export function usePlaceBookingOrder(options?: UsePlaceBookingOrderOptions) {
  const queryClient = useQueryClient();

  return useMutation<
    HomeVisitsServicePlaceOrderResponse,
    ApiError,
    HomeVisitsServiceOrderPreviewPayload
  >({
    mutationFn: (payload) =>
      homeVisitsSingleVendorDiscoveryService.placeBookingOrder(payload),
    onSuccess: (data) => {
      options?.onSuccess?.(data);

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: homeVisitsKeys.singleVendorBookings() }),
        queryClient.invalidateQueries({ queryKey: homeVisitsKeys.all }),
      ]);
    },
    onError: options?.onError,
  });
}
