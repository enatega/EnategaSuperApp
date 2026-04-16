import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../api/types";

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type MultiVendorBottomTabParamList = {
  MultiVendorTabHome: undefined;
  MultiVendorTabSearch: undefined;
  MultiVendorTabOrders: undefined;
  MultiVendorTabProfile: undefined;
};

export type MultiVendorStackParamList = {
  MultiVendorTabs: NavigatorScreenParams<MultiVendorBottomTabParamList> | undefined;
  Favourites: undefined;
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
  SeeAllMapView: {
    items: SeeAllItem[];
    title: string;
  };
  ProductInfo: {
    productId: string;
  };
  ShopTypesSeeAll: undefined;
  TopBrandsSeeAll: undefined;
};
