import type { AddressFlowParamList } from './addressFlowTypes';

export type EditProfileParams = {
  name: string;
  dateOfBirth: string | null;
  gender: string | null;
};

export type ProfileStackParamList = {
  MyProfile:
    | {
        selectionMode?: boolean;
      }
    | undefined;
  EditProfile: EditProfileParams;
};

export type ProfileTabNavigationParamList = ProfileStackParamList & {
  ColorMode: undefined;
  Language: undefined;
  Settings: undefined;
  Support: undefined;
  Wallet: undefined;
};

export type ProfileNavigationParamList =
  ProfileStackParamList & AddressFlowParamList;
