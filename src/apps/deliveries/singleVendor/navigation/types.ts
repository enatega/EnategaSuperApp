import type {
  AddressDetailParams,
  AddressFlowParams,
} from '../../navigation/addressFlowTypes';
import type { DeliveriesAccountStackParamList } from '../../account/navigation/types';

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabOrders: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = DeliveriesAccountStackParamList & {
  SingleVendorTabs: undefined;
  SingleVendorDetails: undefined;
  AddressSearch: AddressFlowParams | undefined;
  AddressChooseOnMap: AddressFlowParams | undefined;
  AddressDetail: AddressDetailParams;
};
