import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../api/types";

export type SeeAllListingType =
  | 'nearby-stores'
  | 'shop-type-products'
  | 'shop-type-stores';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type MultiVendorStackParamList = {
  MultiVendorTabs: undefined;
  Favourites: undefined;
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
};
