import type { DeliveriesAddressFlowParamList } from '../../navigation/addressFlowTypes';
import type { SupportNavigationParamList } from '../../navigation/supportNavigationTypes';

export type EditProfileParams = {
  name: string;
  dateOfBirth: string | null;
  gender: string | null;
};

export type DeliveriesAccountStackParamList = SupportNavigationParamList & {
  MyProfile:
    | {
        selectionMode?: boolean;
      }
    | undefined;
  EditProfile: EditProfileParams;
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
};

export type DeliveriesAccountNavigationParamList =
  DeliveriesAccountStackParamList & DeliveriesAddressFlowParamList;
