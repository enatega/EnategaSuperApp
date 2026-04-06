import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,

} from '../../api/types';
import type { SupportFaqArticleId } from '../../utils/supportFaqArticles';
import type { SupportTicketListItemModel } from '../../utils/supportTicketMappers';

import type {
  AddressDetailParams,
  AddressFlowParams,
} from '../../navigation/addressFlowTypes';


export type SeeAllListingType =
  | 'nearby-stores'
  | 'shop-type-products'
  | 'shop-type-stores';

export type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

export type EditProfileParams = {
  name: string;
  dateOfBirth: string | null;
  gender: string | null;
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
  AddressDetail: AddressDetailParams;
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
  SupportTickets: undefined;
  SupportTicketDetail: {
    ticket: SupportTicketListItemModel;
  };
  RiderChat: {
    chatBoxId?: string;
    estimatedMinutes: number;
    orderCode: string;
    receiverId: string;
    riderAvatarUri?: string;
    riderName: string;
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
    productId: string;
  };
  OrderDetailsScreen: {
    orderId: string;
  };
  OrderTrackingScreen: {
    orderId: string;
  };
};
