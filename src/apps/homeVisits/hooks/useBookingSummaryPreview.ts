import { useQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../general/api/apiClient';
import { homeVisitsKeys } from '../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../singleVendor/api/discoveryService';
import type {
  HomeVisitsServiceOrderPreviewPayload,
  HomeVisitsServiceOrderPreviewResponse,
} from '../singleVendor/api/types';

function buildPreviewQueryKeyInput(payload: HomeVisitsServiceOrderPreviewPayload) {
  return {
    serviceCenterId: payload.serviceCenterId,
    bookingType: payload.bookingType,
    orderType: payload.orderType,
    teamSize: payload.teamSize,
    workingHours: payload.workingHours,
    scheduledAt: payload.scheduledAt,
    slot: payload.slot,
    paymentMethod: payload.paymentMethod,
    paymentMode: payload.payment.method,
    addressId: payload.addressId ?? null,
    discountCode: payload.payment.discountCode ?? null,
    services: payload.services,
  };
}

export function useBookingSummaryPreview(
  payload: HomeVisitsServiceOrderPreviewPayload | null,
) {
  return useQuery<HomeVisitsServiceOrderPreviewResponse, ApiError>({
    queryKey: payload
      ? homeVisitsKeys.bookingSummaryPreview(buildPreviewQueryKeyInput(payload))
      : [...homeVisitsKeys.all, 'booking-summary-preview', 'idle'],
    queryFn: () => {
      if (!payload) {
        throw new Error('Booking summary preview payload is missing.');
      }

      return homeVisitsSingleVendorDiscoveryService.getBookingSummaryPreview(payload);
    },
    enabled: Boolean(payload),
    staleTime: 30 * 1000,
  });
}
