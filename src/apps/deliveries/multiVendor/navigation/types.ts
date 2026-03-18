export type SeeAllListingType = 'nearby-stores' | 'shop-type-products';

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
};
