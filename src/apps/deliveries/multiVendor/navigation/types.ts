import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';

export type SeeAllListingType = 'nearby-stores' | 'shop-type-products';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type MultiVendorStackParamList = {
  MultiVendorTabs: undefined;
  MyProfile: undefined;
  EditProfile: undefined;
  AddressSearch: undefined;
  AddressChooseOnMap: undefined;
  AddressDetail: undefined;
  Favourites: undefined;
  RateOrder: undefined;
  SeeAllScreen: {
    queryType: SeeAllListingType;
    title: string;
    cardType: 'store';
    shopTypeId?: string;
  };
  SeeAllMapView: {
    items: SeeAllItem[];
    title: string;
  };
  Settings: undefined;
  NotificationSettings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  TermsOfUse: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  ColorMode: undefined;
  Language: undefined;
  ProductInfo: {
    productId: string
  }
};
