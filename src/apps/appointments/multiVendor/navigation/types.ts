import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  AppointmentBookingReviewResponse,
  AppointmentBookingSelection,
  AppointmentBookingWorkerMode,
  AppointmentPublicTeamMember,
  AppointmentProvider,
  AppointmentSeeAllSection,
  AppointmentStoreService,
  AppointmentTopBrand,
} from '../../api/types';

export type MultiVendorBottomTabParamList = {
  MultiVendorTabHome: undefined;
  MultiVendorTabSearch: undefined;
  MultiVendorTabBookings: undefined;
  MultiVendorTabProfile: undefined;
};

export type MultiVendorStackParamList = {
  MultiVendorTabs: NavigatorScreenParams<MultiVendorBottomTabParamList> | undefined;
  Favourites: undefined;
  MultiVendorNotifications: undefined;
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
  AppointmentsSeeAll: {
    section: AppointmentSeeAllSection;
    title: string;
    shopTypeId?: string;
    categoryId?: string;
  };
  MultiVendorDetails:
    | {
        provider?: AppointmentProvider;
        brand?: AppointmentTopBrand;
      }
    | undefined;
};
