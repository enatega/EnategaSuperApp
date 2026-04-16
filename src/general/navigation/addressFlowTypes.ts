import { ProfileAppPrefix } from "../api/profileService";

export type AddressFlowOrigin =
  | 'multi-vendor-home'
  | 'profile'
  | 'single-vendor-home'
  | 'chain-home';

export type AddressFlowParams = {
  appPrefix: ProfileAppPrefix;
  editAddressId?: string;
  editType?: string;
  editLocationName?: string;
  origin?: AddressFlowOrigin;
};

export type AddressDetailParams = {
  address: string;
  latitude: number;
  longitude: number;
  appPrefix: ProfileAppPrefix;
  editAddressId?: string;
  editType?: string;
  editLocationName?: string;
  origin?: AddressFlowOrigin;
};

export type AddressFlowParamList = {
  AddressSearch: AddressFlowParams;
  AddressChooseOnMap: AddressFlowParams;
  AddressDetail: AddressDetailParams;
};