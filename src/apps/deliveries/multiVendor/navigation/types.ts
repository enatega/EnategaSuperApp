import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../api/types";
import type { ProductCardVariant } from '../../components/productCard/types';
import type { SupportedCardType } from '../../../../general/components/filterablePaginatedList';
import type { SeeAllListingType } from '../../navigation/sharedTypes';

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
  ProductInfo: {
    productId: string;
  };
  ShopTypesSeeAll: undefined;
  TopBrandsSeeAll: undefined;
};
