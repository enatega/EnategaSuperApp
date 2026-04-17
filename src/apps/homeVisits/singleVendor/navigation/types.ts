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
};

export type HomeVisitsSingleVendorNavigationParamList =
  SingleVendorStackParamList & AddressFlowParamList;
