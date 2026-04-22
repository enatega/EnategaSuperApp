import type { AddressFlowParamList } from "../../../general/navigation/addressFlowTypes";
import type { ProfileNavigationParamList } from "../../../general/navigation/profileTypes";

export type HomeVisitsMode = 'singleVendor' | 'multiVendor' | 'chain';

export type HomeVisitsStackParamList = ProfileNavigationParamList &
  AddressFlowParamList & {
  SingleVendor: undefined;
  MultiVendor: undefined;
  Chain: undefined;
  Settings: undefined;
  NotificationSettings: undefined;
  ChangePassword: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  TermsOfUse: undefined;
  DeleteAccount: undefined;
  Support: undefined;
  Wallet: undefined;
  ColorMode: undefined;
  Language: undefined;
};
