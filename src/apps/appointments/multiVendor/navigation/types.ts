import type { NavigatorScreenParams } from '@react-navigation/native';
import type {
  AppointmentProvider,
  AppointmentSeeAllSection,
  AppointmentTopBrand,
} from '../../api/types';
import type { AppointmentBookingFlowParamList } from '../../navigation/bookingFlowTypes';

export type MultiVendorBottomTabParamList = {
  MultiVendorTabHome: undefined;
  MultiVendorTabSearch: undefined;
  MultiVendorTabBookings: undefined;
  MultiVendorTabProfile: undefined;
};

export type MultiVendorStackParamList = AppointmentBookingFlowParamList & {
  MultiVendorTabs: NavigatorScreenParams<MultiVendorBottomTabParamList> | undefined;
  Favourites: undefined;
  MultiVendorNotifications: undefined;
  AppointmentsSeeAll: {
    section: AppointmentSeeAllSection;
    title: string;
    shopTypeId?: string;
    categoryId?: string;
  };
  MultiVendorDetails:
    | {
        provider?: AppointmentProvider;
        brand?: AppointmentTopBrand;
      }
    | undefined;
};
