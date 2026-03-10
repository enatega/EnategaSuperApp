export type RideStatus = 'scheduled' | 'completed' | 'cancelled' | 'in_progress';

export type RideType = 'ride' | 'women_ride' | 'premium_ride' | 'ac_ride';

export interface Reservation {
  id: string;
  rideType: RideType;
  rideTitle: string;
  imageUrl?: string;
  vehicleInfo?: {
    model: string;
    color: string;
  };
  licensePlate?: string;
  driver?: {
    name: string;
    rating: number;
    rideCount: number;
    image?: string; // URL or local asset
  };
  dateTime: string;
  price: number;
  currency: string;
  status: RideStatus;
  pickupAddress: string;
  dropoffAddress: string;
  paymentMethod: 'cash' | 'card';
  waitTime?: string;
  cancellationPolicy?: string;
}

export type ReservationListViewState = 'idle' | 'loading' | 'success' | 'error';

export type ReservationDetailViewState = 'idle' | 'loading' | 'success' | 'error';
