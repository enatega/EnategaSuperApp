import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AddressFlowParamList } from "../../../../general/navigation/addressFlowTypes";

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabOrders: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = {
  SingleVendorTabs: NavigatorScreenParams<SingleVendorBottomTabParamList> | undefined;
  SingleVendorDetails: undefined;
  SingleVendorCategoriesSeeAll: undefined;
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
  ServiceDetailsPage: {
    serviceId: string;
  };
};

export type HomeVisitsSingleVendorNavigationParamList =
  SingleVendorStackParamList & AddressFlowParamList;
