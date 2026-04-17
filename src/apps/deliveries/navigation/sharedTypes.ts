import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../api/types';
import { SupportedCardType } from '../../../general/components/filterablePaginatedList';
import { ProductCardVariant } from '../components/productCard/types';

export type SeeAllListingType =
  | 'nearby-stores'
  | 'shop-type-products'
  | 'shop-type-stores'
  | 'top-brand-stores'
  | 'single-vendor-category-products'
  | 'chain-category-products';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type DeliveriesSeeAllParamList = {
  SeeAllScreen: {
    queryType: SeeAllListingType;
    title: string;
    cardType: SupportedCardType;
    shopTypeId?: string;
    vendorId?: string;
    categoryId?: string;
    cardVariant?: ProductCardVariant;
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
