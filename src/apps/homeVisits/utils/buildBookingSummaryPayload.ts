import type { DeliveryAddress } from '../../../general/hooks/useAddress';
import type {
  HomeVisitsReviewAndConfirmRouteParams,
  HomeVisitsScheduledSlot,
} from '../types/teamSchedule';

type BookingSummaryServicePayload = {
  serviceId: string;
  isPrimary: boolean;
  quantity: number;
  selection: {
    serviceTypeOptionId: string | null;
    additionalServiceOptionIds: string[];
  } | null;
};

export type HomeVisitsBookingSummaryPreviewPayload = {
  serviceCenterId: string;
  bookingType: 'one_time' | 'contract';
  addressId: string | null;
  scheduledAt: string;
  timezone: string;
  teamSize: number;
  workingHours: number;
  slot: HomeVisitsScheduledSlot;
  services: BookingSummaryServicePayload[];
  payment: {
    method: 'cash' | 'card';
    discountCode: string | null;
  };
  notes: string | null;
  source: 'mobile_app';
};

function toBookingType(value: HomeVisitsReviewAndConfirmRouteParams['serviceMode']) {
  return value === 'contract' ? 'contract' : 'one_time';
}

export function buildBookingSummaryPreviewPayload(params: {
  routeParams: HomeVisitsReviewAndConfirmRouteParams;
  selectedAddress: DeliveryAddress | null;
  notes: string;
  paymentMethod: 'cash' | 'card';
  discountCode: string;
  scheduledAtIso: string;
  scheduledSlot: HomeVisitsScheduledSlot;
}) {
  const {
    discountCode,
    notes,
    paymentMethod,
    routeParams,
    scheduledAtIso,
    scheduledSlot,
    selectedAddress,
  } = params;

  const primaryService: BookingSummaryServicePayload = {
    serviceId: routeParams.serviceId,
    isPrimary: true,
    quantity: 1,
    selection: {
      serviceTypeOptionId: routeParams.initialSelection.selectedServiceTypeId,
      additionalServiceOptionIds: Object.values(
        routeParams.initialSelection.selectedAdditionalByGroup,
      ).flat(),
    },
  };

  const additionalServices: BookingSummaryServicePayload[] = routeParams.selectedServiceIds
    .filter((serviceId) => serviceId !== routeParams.serviceId)
    .map((serviceId) => ({
      serviceId,
      isPrimary: false,
      quantity: 1,
      selection: null,
    }));

  return {
    serviceCenterId: routeParams.serviceCenterId,
    bookingType: toBookingType(routeParams.serviceMode),
    addressId: selectedAddress?.id ?? null,
    scheduledAt: scheduledAtIso,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    teamSize: routeParams.teamSize,
    workingHours: routeParams.workingHours,
    slot: scheduledSlot,
    services: [primaryService, ...additionalServices],
    payment: {
      method: paymentMethod,
      discountCode: discountCode.trim() || null,
    },
    notes: notes.trim() || null,
    source: 'mobile_app',
  } as HomeVisitsBookingSummaryPreviewPayload;
}
