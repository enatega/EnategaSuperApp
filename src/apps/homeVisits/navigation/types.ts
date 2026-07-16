import type { NavigatorScreenParams } from "@react-navigation/native";
import type { AddressFlowParamList } from "../../../general/navigation/addressFlowTypes";
import type { ProfileNavigationParamList } from "../../../general/navigation/profileTypes";
import type { ChainStackParamList } from "../chain/navigation/types";

export type HomeVisitsMode = 'singleVendor' | 'multiVendor' | 'chain';

export type HomeVisitsStackParamList = ProfileNavigationParamList &
  AddressFlowParamList & {
  HomeVisitsModeSelector: undefined;
  SingleVendor: undefined;
  MultiVendor: undefined;
  Chain: NavigatorScreenParams<ChainStackParamList> | undefined;
  Settings: undefined;
  NotificationSettings: undefined;
  ChangePassword: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  TermsOfUse: undefined;
  DeleteAccount: undefined;
  Support: undefined;
  SupportFaq: undefined;
  SupportContactForm: {
    issueLabel: string;
    issueValue: string;
  };
  SupportConversations: undefined;
  SupportTickets: undefined;
  SupportChat:
    | {
        agentName?: string;
        chatBoxId?: string;
        receiverId?: string;
      }
    | undefined;
  Wallet: undefined;
  WalletAddCard: undefined;
  WalletTransactions: undefined;
  ColorMode: undefined;
  Language: undefined;
};
