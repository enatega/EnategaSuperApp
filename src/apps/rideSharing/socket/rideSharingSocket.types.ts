import type { ActiveRideRequestPayload, CreateRidePayload, RideBidPayload } from '../api/types';

export type RideSharingServerEventMap = {
  'received-bids': RideBidPayload | RideBidPayload[];
  'ride:bid:new': {
    rideRequestId: string;
    bid: RideBidPayload;
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
    riderSId: string;
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
