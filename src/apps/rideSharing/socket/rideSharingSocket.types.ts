import type { CreateRidePayload } from '../api/types';
import type { FindingRideBid } from '../screens/findingRide/types/bids';

export type RideSharingServerEventMap = {
  'received-bids': unknown;
  'ride:bid:new': {
    rideRequestId: string;
    bid: FindingRideBid;
  };
  'ride:bid:removed': {
    rideRequestId: string;
    bidId: string;
  };
  'ride:request:accepted': {
    rideRequestId: string;
    driverId: string;
  };
};

export type RideSharingClientEventMap = {
  'ride-request-created-by-customer': {
    rideRequestData: CreateRidePayload & {
      passenger_user_id?: string;
      ride_request_id?: string;
    };
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  'ride-cancelled': {
    rideId: string;
    genericUserId: string;
  };
  'ride-request-cancelled-by-customer': {
    rideRequestId: string;
  };
};

export type RideSharingServerEventName = keyof RideSharingServerEventMap;
export type RideSharingClientEventName = keyof RideSharingClientEventMap;
