import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DeliveriesAccountNavigationParamList } from '../account/navigation/types';
import type { MultiVendorStackParamList } from '../multiVendor/navigation/types';
import type { SingleVendorStackParamList } from '../singleVendor/navigation/types';

export type DeliveriesStackParamList = DeliveriesAccountNavigationParamList & {
  DeliveriesHome: undefined;
  SingleVendor: NavigatorScreenParams<SingleVendorStackParamList> | undefined;
  MultiVendor: NavigatorScreenParams<MultiVendorStackParamList> | undefined;
  Chain: undefined;
  ProductInfo: {
    productId: string;
  };
  Cart: undefined;
};
