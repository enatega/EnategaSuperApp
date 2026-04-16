import type { RiderChatScreenParams } from '../screens/RiderChatScreen/RiderChatScreen';
import type { NavigatorScreenParams } from "@react-navigation/native";
import type { ProfileNavigationParamList } from "../../../general/navigation/profileTypes";
import type { ChainStackParamList } from "../chain/navigation/types";
import type { MultiVendorStackParamList } from "../multiVendor/navigation/types";
import type { SingleVendorStackParamList } from "../singleVendor/navigation/types";
import { SupportedCardType } from "../components/filterablePaginatedList";
import { ProductCardVariant } from "../components/productCard/types";

export type SeeAllListingType =
  | "nearby-stores"
  | "shop-type-products"
  | "shop-type-stores"
  | "top-brand-stores"
  | "single-vendor-category-products"
  | "chain-category-products";

export type DealsSeeAllSource = "multi-vendor" | "single-vendor" | "chain-vendor";

type DeliveriesAccountNavigationParamList = ProfileNavigationParamList & {
  Settings: undefined;
  NotificationSettings: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  TermsOfUse: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  ColorMode: undefined;
  Language: undefined;
  Support: undefined;
  Wallet: undefined;
  AddCard: undefined;
  WalletTransactions: undefined;
  SupportChat: import('./supportNavigationTypes').SupportNavigationParamList['SupportChat'];
  SupportConversations: undefined;
  SupportContactForm: import('./supportNavigationTypes').SupportNavigationParamList['SupportContactForm'];
  SupportFaq: undefined;
  SupportFaqArticle: import('./supportNavigationTypes').SupportNavigationParamList['SupportFaqArticle'];
  SupportTickets: undefined;
  SupportTicketDetail: import('./supportNavigationTypes').SupportNavigationParamList['SupportTicketDetail'];
};

export type DeliveriesStackParamList = DeliveriesAccountNavigationParamList & {
  DeliveriesHome: undefined;
  SingleVendor: NavigatorScreenParams<SingleVendorStackParamList> | undefined;
  MultiVendor: NavigatorScreenParams<MultiVendorStackParamList> | undefined;
  Chain: NavigatorScreenParams<ChainStackParamList> | undefined;
  RateOrder: {
    orderId: string;
    storeName: string;
  };
  OrderDetailsScreen: {
    orderId: string;
  };
  OrderTrackingScreen: {
    orderId: string;
  };
  RiderChat: RiderChatScreenParams['RiderChat'];
  ProductInfo: {
    productId: string;
  };
  Cart: undefined;
  Checkout: undefined;
  SingleVendorCategoriesSeeAll: undefined;
  SingleVendorCategoryProductsSeeAll: {
    categoryId: string;
    title: string;
  };
  ChainCategoriesSeeAll: undefined;
  ChainCategoryProductsSeeAll: {
    categoryId: string;
    title: string;
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
  DealsSeeAll:
    | {
        source?: DealsSeeAllSource;
      }
    | undefined;
};
