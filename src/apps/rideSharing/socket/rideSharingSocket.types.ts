import type { ActiveRideRequestPayload, CreateRidePayload } from '../api/types';
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
  'bid-accepted': {
    rideRequestId: string;
    riderUserId: string;
    startType: string;
  };
  'ride-request-created-by-customer': {
    rideRequestData: CreateRidePayload & {
      passenger_user_id?: string;
      ride_request_id?: string;
    };
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  'ride-request-fare-raised': {
    rideRequestData: ActiveRideRequestPayload & {
      previousFare?: number;
      newFare?: number;
      passenger_user_id?: string;
    };
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  'ride-cancelled': {
    rideId: string;
    genericUserId: string;
  };
};

export type RideSharingServerEventName = keyof RideSharingServerEventMap;
export type RideSharingClientEventName = keyof RideSharingClientEventMap;
