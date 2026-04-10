import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../api/types';

export type SeeAllListingType =
  | 'nearby-stores'
  | 'shop-type-products'
  | 'shop-type-stores'
  | 'top-brand-stores';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type DeliveriesSeeAllParamList = {
  SeeAllScreen: {
    queryType: SeeAllListingType;
    title: string;
    cardType: 'store';
    shopTypeId?: string;
    vendorId?: string;
  };
  SeeAllMapView: {
    items: SeeAllItem[];
    title: string;
  };
};

export type DeliveriesStoreDetailsParamList = {
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
};

export type DeliveriesProductInfoParamList = {
  ProductInfo: {
    productId: string;
  };
};
