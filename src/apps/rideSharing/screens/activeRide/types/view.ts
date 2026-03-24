import type { RideAddressSelection } from '../../../api/types';

export type ActiveRideViewData = {
  rideId: string;
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  title: string;
  statusLabel?: string;
  fare?: number;
  paymentMethodLabel?: string;
  driverName?: string;
  driverRating?: number;
  driverAvatarUri?: string;
  driverPhone?: string;
  vehicleName?: string;
  vehicleColor?: string;
  licensePlate?: string;
  driverCoordinate?: {
    latitude: number;
    longitude: number;
  };
};
