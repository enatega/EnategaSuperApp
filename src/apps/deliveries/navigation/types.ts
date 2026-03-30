import type { NavigatorScreenParams } from '@react-navigation/native';
import type { MultiVendorStackParamList } from '../multiVendor/navigation/types';

export type DeliveriesStackParamList = {
  DeliveriesHome: undefined;
  SingleVendor: undefined;
  MultiVendor: NavigatorScreenParams<MultiVendorStackParamList> | undefined;
  Chain: undefined;
};
