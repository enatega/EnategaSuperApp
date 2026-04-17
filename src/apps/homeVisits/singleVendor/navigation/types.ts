import type { AddressFlowParamList } from "../../../../general/navigation/addressFlowTypes";

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabOrders: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = {
  SingleVendorTabs: undefined;
  SingleVendorDetails: undefined;
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
