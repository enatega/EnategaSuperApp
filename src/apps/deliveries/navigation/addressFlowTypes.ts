export type AddressFlowOrigin =
  | 'multi-vendor-home'
  | 'profile'
  | 'single-vendor-home';

export type AddressFlowParams = {
  editAddressId?: string;
  editType?: string;
  editLocationName?: string;
  origin?: AddressFlowOrigin;
};

export type AddressDetailParams = {
  address: string;
  latitude: number;
  longitude: number;
  editAddressId?: string;
  editType?: string;
  editLocationName?: string;
  origin?: AddressFlowOrigin;
};

export type DeliveriesAddressFlowParamList = {
  AddressSearch: AddressFlowParams | undefined;
  AddressChooseOnMap: AddressFlowParams | undefined;
  AddressDetail: AddressDetailParams;
};
