import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../api/types";
import type {
  AddressDetailParams,
  AddressFlowParams,
} from '../../navigation/addressFlowTypes';
import type { DeliveriesAccountStackParamList } from '../../account/navigation/types';

export type SeeAllListingType =
  | 'nearby-stores'
  | 'shop-type-products'
  | 'shop-type-stores';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type MultiVendorStackParamList = DeliveriesAccountStackParamList & {
  MultiVendorTabs: undefined;
  AddressSearch: AddressFlowParams | undefined;
  AddressChooseOnMap: AddressFlowParams | undefined;
  AddressDetail: AddressDetailParams;
  Favourites: undefined;
  RateOrder: {
    orderId: string;
    storeName: string;
  };
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
  SeeAllScreen: {
    queryType: SeeAllListingType;
    title: string;
    cardType: "store";
    shopTypeId?: string;
  };
  SeeAllMapView: {
    items: SeeAllItem[];
    title: string;
  };
  ProductInfo: {
    productId: string;
  };
  OrderDetailsScreen: {
    orderId: string;
  };
  OrderTrackingScreen: {
    orderId: string;
  };
};
