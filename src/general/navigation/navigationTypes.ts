import type { NavigatorScreenParams } from '@react-navigation/native';

export type SharedStackParamList = {
  Home: undefined;
  Deliveries: undefined;
  RideSharing: undefined;
  HomeVisits: undefined;
  Appointments: undefined;
  DeveloperMode: undefined;
  Auth: undefined;
  ProductInfo: {
    productId?: string;
  } | undefined;
};

export type SharedAppRouteName = Exclude<
  keyof SharedStackParamList,
  "Home" | "Auth" | "ProductInfo"
>;

export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<SharedStackParamList> | undefined;
};
