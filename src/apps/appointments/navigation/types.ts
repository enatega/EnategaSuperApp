import type { NavigatorScreenParams } from '@react-navigation/native';
import type { ChainStackParamList } from '../chain/navigation/types';
import type { MultiVendorStackParamList } from '../multiVendor/navigation/types';
import type { SingleVendorStackParamList } from '../singleVendor/navigation/types';

export type AppointmentsStackParamList = {
  AppointmentsHome: undefined;
  AppointmentDetails: undefined;
  SingleVendor: NavigatorScreenParams<SingleVendorStackParamList> | undefined;
  MultiVendor: NavigatorScreenParams<MultiVendorStackParamList> | undefined;
  Chain: NavigatorScreenParams<ChainStackParamList> | undefined;
};
