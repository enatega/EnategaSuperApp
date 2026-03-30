import type { NavigatorScreenParams } from '@react-navigation/native';
import type { DeliveriesStackParamList } from '../../apps/deliveries/navigation/types';

export type SharedStackParamList = {
  Home: undefined;
  Deliveries: NavigatorScreenParams<DeliveriesStackParamList> | undefined;
  RideSharing: undefined;
  HomeVisits: undefined;
  Appointments: undefined;
  DeveloperMode: undefined;
  Auth: undefined;
};

export type SharedAppRouteName = Exclude<keyof SharedStackParamList, 'Home' | 'Auth'>;

export type RootStackParamList = {
  Splash: undefined;
  Main: NavigatorScreenParams<SharedStackParamList> | undefined;
};
