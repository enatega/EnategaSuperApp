import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AddressFlowParamList } from "../../../../general/navigation/addressFlowTypes";
import type { HomeVisitsMultiVendorProvider } from '../api/types';
import type { HomeVisitsServiceDetailsSelectionState } from '../../types/serviceDetails';
import type {
  HomeVisitsChooseDateAndTimeRouteParams,
  HomeVisitsReviewAndConfirmRouteParams,
  HomeVisitsTeamAndScheduleRouteParams,
} from '../../types/teamSchedule';

export type MultiVendorBottomTabParamList = {
  MultiVendorTabHome: undefined;
  MultiVendorTabSearch: undefined;
  MultiVendorTabOrders: undefined;
  MultiVendorTabProfile: undefined;
};

export type MultiVendorStackParamList = {
  MultiVendorTabs: NavigatorScreenParams<MultiVendorBottomTabParamList> | undefined;
  MultiVendorFavorites: undefined;
  MultiVendorNotifications: undefined;
  MultiVendorSeeAll: {
    scope?: 'single-vendor' | 'multi-vendor' | 'chain';
    queryType:
      | 'nearby-services'
      | 'most-popular-services'
      | 'deals-services'
      | 'category-services';
    title: string;
    cardType?: 'service';
    cardVariant?: 'default';
    categoryId?: string;
    mainServiceId?: string;
    providerId?: string;
    latitude?: number;
    longitude?: number;
  };
  MultiVendorCentersSeeAll: {
    title: string;
    scope?: 'top-centers' | 'service-providers';
    mainServiceId?: string;
    latitude?: number;
    longitude?: number;
  };
  MultiVendorServiceTypeDetails: {
    initialMainServiceId?: string;
    title?: string;
  };
  MultiVendorCenterDetails: {
    provider: HomeVisitsMultiVendorProvider;
  };
  MultiVendorBookingDetails: {
    orderId: string;
  };
  MultiVendorContractDetails: {
    contractId: string;
  };
  MultiVendorTrackWorker: {
    orderId: string;
    source?: 'booking_details' | 'home_active_service';
  };
  MultiVendorManageAppointment: {
    orderId: string;
  };
  MultiVendorCancelAppointment: {
    orderId: string;
  };
  SingleVendorBookingDetails: {
    orderId: string;
  };
  SingleVendorContractDetails: {
    contractId: string;
  };
  SingleVendorTrackWorker: {
    orderId: string;
    source?: 'booking_details' | 'home_active_service';
  };
  SingleVendorManageAppointment: {
    orderId: string;
  };
  SingleVendorCancelAppointment: {
    orderId: string;
  };
  ServiceDetails: {
    serviceId: string;
    bookingFlow?: 'singleVendor' | 'multiVendor';
  };
  ServiceDetailsBooking: {
    serviceId: string;
    serviceCenterId: string;
    bookingFlow?: 'singleVendor' | 'multiVendor';
    initialSelection: HomeVisitsServiceDetailsSelectionState;
  };
  TeamAndSchedule: HomeVisitsTeamAndScheduleRouteParams;
  ChooseDateAndTime: HomeVisitsChooseDateAndTimeRouteParams;
  ReviewAndConfirm: HomeVisitsReviewAndConfirmRouteParams;
} & AddressFlowParamList;
