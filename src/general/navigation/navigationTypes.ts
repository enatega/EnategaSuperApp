import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  SharedAppRouteName,
  SharedStackAppRoutes,
} from '../../apps/registry/generated/appRegistry';

export type AuthStackParamList = {
  introBanner: undefined;
  login: undefined;
  enterPhoneNumber: undefined;
  enterPhoneOtpLogin: undefined;
  enterPhoneOtpSignup: undefined;
  enterEmailOtpSignup: undefined;
  signup: undefined;
  enterEmail: undefined;
  enterPassword: undefined;
  forgetPasswordEnterEmail: undefined;
  createNewPassword: undefined;
  forgetPasswordEnterOtp: undefined;
};

export type SharedStackParamList = {
  Home: undefined;
} & SharedStackAppRoutes & {
  Auth:
    | {
        screen?: keyof AuthStackParamList;
      }
    | undefined;
  ProductInfo: {
    productId?: string;
  } | undefined;
};

export type { SharedAppRouteName };

export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<SharedStackParamList> | undefined;
};
