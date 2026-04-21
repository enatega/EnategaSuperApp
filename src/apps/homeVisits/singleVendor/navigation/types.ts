import type { AddressFlowParamList } from "../../../../general/navigation/addressFlowTypes";
import type { HomeVisitsServiceDetailsSelectionState } from '../../types/serviceDetails';
import type {
  HomeVisitsReviewAndConfirmRouteParams,
  HomeVisitsTeamAndScheduleRouteParams,
} from '../../types/teamSchedule';

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabOrders: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = {
  SingleVendorTabs: undefined;
  SingleVendorDetails: undefined;
  SingleVendorCategoriesSeeAll: undefined;
  SingleVendorFavorites: undefined;
  SeeAllScreen: {
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
    latitude?: number;
    longitude?: number;
  };
  SingleVendorBookingDetails: {
    orderId: string;
  };
  SingleVendorManageAppointment: {
    orderId: string;
  };
  SingleVendorCancelAppointment: {
    orderId: string;
  };
  ServiceDetails: {
    serviceId: string;
  };
  ServiceDetailsBooking: {
    serviceId: string;
    serviceCenterId: string;
    initialSelection: HomeVisitsServiceDetailsSelectionState;
  };
  TeamAndSchedule: HomeVisitsTeamAndScheduleRouteParams;
  ReviewAndConfirm: HomeVisitsReviewAndConfirmRouteParams;
};

export type HomeVisitsSingleVendorNavigationParamList =
  SingleVendorStackParamList & AddressFlowParamList;
