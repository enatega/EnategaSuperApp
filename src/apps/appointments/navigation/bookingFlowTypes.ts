import type {
  AppointmentBookingReviewResponse,
  AppointmentBookingSelection,
  AppointmentBookingWorkerMode,
  AppointmentPublicTeamMember,
  AppointmentStoreService,
} from '../api/types';

export type AppointmentBookingFlowParamList = {
  Services: {
    storeId: string;
    title: string;
    initialCategoryId?: string | null;
    initialSubcategoryId?: string | null;
    initialServiceId?: string | null;
  };
  AppointmentCart: {
    storeId: string;
    title: string;
  };
  Team: {
    storeId: string;
    title: string;
    team: AppointmentPublicTeamMember[];
    selectedServices?: AppointmentStoreService[];
    retrySelection?: {
      mode: AppointmentBookingWorkerMode;
      workerId?: string;
    };
    retryErrorMessage?: string;
  };
  ReviewConfirm: {
    review: AppointmentBookingReviewResponse;
    scheduledAt: string;
    selections: AppointmentBookingSelection[];
    storeId: string;
    title: string;
    team: AppointmentPublicTeamMember[];
    selectedServices?: AppointmentStoreService[];
    workerMode: AppointmentBookingWorkerMode;
    workerId?: string;
  };
  BookingSuccess: {
    orderId: string;
    storeName: string;
  };
  AppointmentBookingDetail: {
    orderId: string;
  };
};
