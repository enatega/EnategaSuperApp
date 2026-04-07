import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DeliveriesAccountNavigationParamList } from '../account/navigation/types';
import type { ChainStackParamList } from '../chain/navigation/types';
import type { MultiVendorStackParamList } from '../multiVendor/navigation/types';
import type { SingleVendorStackParamList } from '../singleVendor/navigation/types';

export type DeliveriesStackParamList = DeliveriesAccountNavigationParamList & {
  DeliveriesHome: undefined;
  SingleVendor: NavigatorScreenParams<SingleVendorStackParamList> | undefined;
  MultiVendor: NavigatorScreenParams<MultiVendorStackParamList> | undefined;
  Chain: NavigatorScreenParams<ChainStackParamList> | undefined;
  RateOrder: {
    orderId: string;
    storeName: string;
  };
  OrderDetailsScreen: {
    orderId: string;
  };
  OrderTrackingScreen: {
    orderId: string;
  };
  ProductInfo: {
    productId: string;
  };
  Cart: undefined;
  Checkout: undefined;
};
