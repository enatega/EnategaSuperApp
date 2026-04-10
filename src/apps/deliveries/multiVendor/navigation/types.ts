import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../api/types";


export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type MultiVendorStackParamList = {
  MultiVendorTabs: undefined;
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
