import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AppointmentProvider, AppointmentTopBrand } from '../../api/types';
import type { AppointmentBookingFlowParamList } from '../../navigation/bookingFlowTypes';

export type ChainBottomTabParamList = {
  ChainTabHome: undefined;
  ChainTabSearch: undefined;
  ChainTabBookings: undefined;
  ChainTabProfile: undefined;
};

export type ChainStackParamList = AppointmentBookingFlowParamList & {
  ChainTabs: NavigatorScreenParams<ChainBottomTabParamList> | undefined;
  ChainDetails:
    | {
        provider?: AppointmentProvider;
        brand?: AppointmentTopBrand;
      }
    | undefined;
  ChainFavouriteBranches: undefined;
};
