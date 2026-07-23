import type { AppointmentProvider, AppointmentTopBrand } from '../../api/types';

export type SingleVendorBottomTabParamList = {
  SingleVendorTabHome: undefined;
  SingleVendorTabSearch: undefined;
  SingleVendorTabBookings: undefined;
  SingleVendorTabProfile: undefined;
};

export type SingleVendorStackParamList = {
  SingleVendorTabs: undefined;
  SingleVendorDetails:
    | {
        provider?: AppointmentProvider;
        brand?: AppointmentTopBrand;
      }
    | undefined;
};
