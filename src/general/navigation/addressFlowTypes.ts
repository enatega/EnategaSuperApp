export type AddressFlowOrigin =
  | 'multi-vendor-home'
  | 'profile'
  | 'single-vendor-home'
  | 'chain-home';

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

export type AddressFlowParamList = {
  AddressSearch: AddressFlowParams | undefined;
  AddressChooseOnMap: AddressFlowParams | undefined;
  AddressDetail: AddressDetailParams;
};