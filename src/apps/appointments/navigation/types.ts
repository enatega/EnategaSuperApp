import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ChainStackParamList } from '../chain/navigation/types';
import type { MultiVendorStackParamList } from '../multiVendor/navigation/types';
import type { SingleVendorStackParamList } from '../singleVendor/navigation/types';
import type { AddressFlowParamList } from '../../../general/navigation/addressFlowTypes';

export type AppointmentsStackParamList = {
  AppointmentsHome: undefined;
  AppointmentDetails: undefined;
  SingleVendor: NavigatorScreenParams<SingleVendorStackParamList> | undefined;
  MultiVendor: NavigatorScreenParams<MultiVendorStackParamList> | undefined;
  Chain: NavigatorScreenParams<ChainStackParamList> | undefined;
  AddressSearch: AddressFlowParamList['AddressSearch'];
  AddressChooseOnMap: AddressFlowParamList['AddressChooseOnMap'];
  AddressDetail: AddressFlowParamList['AddressDetail'];
};
