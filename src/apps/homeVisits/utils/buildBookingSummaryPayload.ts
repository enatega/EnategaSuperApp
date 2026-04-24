import type {
  HomeVisitsOrderPaymentMethod,
  HomeVisitsServiceOrderPreviewPayload,
  HomeVisitsServicePaymentMethod,
} from '../singleVendor/api/types';
import type {
  HomeVisitsReviewAndConfirmRouteParams,
  HomeVisitsScheduledSlot,
} from '../types/teamSchedule';

function toBookingType(value: HomeVisitsReviewAndConfirmRouteParams['serviceMode']) {
  return value === 'contract' ? 'contract' : 'one_time';
}

function toOrderPaymentMethod(value: HomeVisitsServicePaymentMethod): HomeVisitsOrderPaymentMethod {
  return value === 'card' ? 'stripe' : 'cod';
}

export function buildBookingSummaryPreviewPayload(params: {
  routeParams: HomeVisitsReviewAndConfirmRouteParams;
  addressId?: string;
  notes: string;
  customerNote: string;
  paymentMethod: HomeVisitsServicePaymentMethod;
  discountCode: string;
  scheduledAtIso: string;
  scheduledSlot: HomeVisitsScheduledSlot;
}) {
  const {
    addressId,
    discountCode,
    notes,
    customerNote,
    paymentMethod,
    routeParams,
    scheduledAtIso,
    scheduledSlot,
  } = params;

  const primaryService: HomeVisitsServiceOrderPreviewPayload['services'][number] = {
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

  const additionalServices: HomeVisitsServiceOrderPreviewPayload['services'] = routeParams.selectedServiceIds
    .filter((serviceId) => serviceId !== routeParams.serviceId)
    .map((serviceId) => ({
      serviceId,
      isPrimary: false,
      quantity: 1,
      selection: null,
    }));

  return {
    serviceCenterId: routeParams.serviceCenterId,
    orderType: addressId ? 'delivery' : 'pickup',
    paymentMethod: toOrderPaymentMethod(paymentMethod),
    bookingType: toBookingType(routeParams.serviceMode),
    addressId,
    scheduledAt: scheduledAtIso,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    teamSize: routeParams.teamSize,
    workingHours: routeParams.workingHours,
    contractDays: routeParams.serviceMode === 'contract' ? routeParams.contractDays : undefined,
    slot: scheduledSlot,
    services: [primaryService, ...additionalServices],
    payment: {
      method: paymentMethod,
      discountCode: discountCode.trim() || undefined,
    },
    notes: notes.trim() || null,
    customerNote: customerNote.trim() || null,
    source: 'mobile_app',
    riderTip: 0,
  } as HomeVisitsServiceOrderPreviewPayload;
}
