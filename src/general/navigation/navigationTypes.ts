import type { NavigatorScreenParams } from '@react-navigation/native';
import type { SharedStackAppRoutes } from '../../apps/registry/generated/appRegistry';

export type SharedStackParamList = {
  Home: undefined;
} & SharedStackAppRoutes & {
  Auth: undefined;
  ProductInfo: {
    productId?: string;
  } | undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<SharedStackParamList> | undefined;
};
