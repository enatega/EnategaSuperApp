import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from '../../api/types';
import type { SupportFaqArticleId } from '../../utils/supportFaqArticles';

export type SeeAllListingType = 'nearby-stores' | 'shop-type-products';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type EditProfileParams = {
  name: string;
  dateOfBirth: string | null;
  gender: string | null;
};

export type AddressFlowOrigin = 'home-header' | 'profile';

export type AddressFlowParams = {
  editAddressId?: string;
  editType?: string;
  editLocationName?: string;
  origin?: AddressFlowOrigin;
};

export type MultiVendorStackParamList = {
  MultiVendorTabs: undefined;
  MyProfile:
    | {
        selectionMode?: boolean;
      }
    | undefined;
  EditProfile: EditProfileParams;
  AddressSearch: AddressFlowParams | undefined;
  AddressChooseOnMap: AddressFlowParams | undefined;
  AddressDetail: {
    address: string;
    latitude: number;
    longitude: number;
    editAddressId?: string;
    editType?: string;
    editLocationName?: string;
    origin?: AddressFlowOrigin;
  };
  Favourites: undefined;
  RateOrder: {
    orderId: string;
    storeName: string;
  };
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
  Support: undefined;
  SupportChat:
    | {
        agentName?: string;
        chatBoxId?: string;
        receiverId?: string;
      }
    | undefined;
  SupportFaq: undefined;
  SupportConversations: undefined;
  SupportContactForm: {
    issueLabel: string;
    issueValue: string;
  };
  SupportFaqArticle: {
    articleId: SupportFaqArticleId;
  };
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
