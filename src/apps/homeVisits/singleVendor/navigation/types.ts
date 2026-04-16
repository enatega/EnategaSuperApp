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
};

export type HomeVisitsSingleVendorNavigationParamList =
  SingleVendorStackParamList & AddressFlowParamList;
