import type {
  AddressDetailParams,
  AddressFlowParams,
} from '../../navigation/addressFlowTypes';

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabOrders: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = {
  SingleVendorTabs: undefined;
  SingleVendorDetails: undefined;
  AddressSearch: AddressFlowParams | undefined;
  AddressChooseOnMap: AddressFlowParams | undefined;
  AddressDetail: AddressDetailParams;
};
