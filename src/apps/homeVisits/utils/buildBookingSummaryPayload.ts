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

function resolveContractDays(routeParams: HomeVisitsReviewAndConfirmRouteParams) {
  if (routeParams.serviceMode !== 'contract') {
    return undefined;
  }

  if (typeof routeParams.contractDays === 'number' && routeParams.contractDays > 0) {
    return routeParams.contractDays;
  }

  return routeParams.selectedDateUnixList?.length;
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
    workerType: routeParams.workerType,
    workingHours: routeParams.workingHours,
    contractDays: resolveContractDays(routeParams),
    contractType: routeParams.serviceMode === 'contract' ? routeParams.contractType : undefined,
    repeatEnabled: routeParams.serviceMode === 'contract' ? routeParams.repeatEnabled : false,
    contractEndDateUnix: routeParams.serviceMode === 'contract'
      ? (routeParams.contractEndDateUnix ?? routeParams.repeatEndDateUnix)
      : undefined,
    repeatEndDateUnix: routeParams.serviceMode === 'contract' ? routeParams.repeatEndDateUnix : undefined,
    selectedDateUnix: routeParams.selectedDateUnix,
    selectedDateUnixList: routeParams.selectedDateUnixList,
    selectedWeekdays: routeParams.selectedWeekdays,
    startTimeUnix: routeParams.startTimeUnix,
    endTimeUnix: routeParams.endTimeUnix,
    slot: scheduledSlot,
    services: [primaryService, ...additionalServices],
    payment: {
      method: paymentMethod,
      discountCode: discountCode.trim() || undefined,
    },
    jobDescription: (routeParams.jobDescription ?? notes).trim() || null,
    notes: notes.trim() || null,
    customerNote: customerNote.trim() || null,
    source: 'mobile_app',
    riderTip: 0,
  } as HomeVisitsServiceOrderPreviewPayload;
}
