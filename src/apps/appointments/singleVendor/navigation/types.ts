import type { AppointmentProvider, AppointmentTopBrand } from '../../api/types';
import type { AppointmentBookingFlowParamList } from '../../navigation/bookingFlowTypes';

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabBookings: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = AppointmentBookingFlowParamList & {
  SingleVendorTabs: undefined;
  SingleVendorDetails:
    | {
        provider?: AppointmentProvider;
        brand?: AppointmentTopBrand;
      }
    | undefined;
  SingleVendorFavouriteServices: undefined;
};
