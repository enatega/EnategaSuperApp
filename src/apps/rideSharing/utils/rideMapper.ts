import { CustomerRideListItem, CustomerRideDetail } from '../api/types';
import { Reservation, RideStatus } from '../types/reservation';
import { getRideSharingCurrencyLabel } from '../../../general/stores/useAppConfigStore';

function mapApiStatus(rideStatus: string): RideStatus {
  switch (rideStatus) {
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
      return 'cancelled';
    case 'IN_PROGRESS':
      return 'in_progress';
    case 'ASSIGNED':
    case 'SCHEDULED':
    default:
      return 'scheduled';
  }
}

/** Map a list-level item (slim) to a Reservation for the list screen. */
export const mapCustomerRideToReservation = (ride: CustomerRideListItem): Reservation => {
  return {
    id: ride.rideId,
    rideType: 'ride',
    rideTitle: ride.rideType.name,
    imageUrl: ride.rideType.imageUrl,
    dateTime: ride.scheduledAt || ride.createdAt,
    price: ride.agreedPrice,
    currency: getRideSharingCurrencyLabel(),
    status: mapApiStatus(ride.rideStatus),
    // These fields are not available in the list endpoint; provide defaults
    pickupAddress: '',
    dropoffAddress: '',
    paymentMethod: 'cash',
  };
};

/** Map the detail endpoint response to a full Reservation. */
export const mapCustomerRideDetailToReservation = (ride: CustomerRideDetail): Reservation => {
  return {
    id: ride.rideId,
    rideType: 'ride',
    rideTitle: ride.rideType.name,
    imageUrl: ride.rideType.imageUrl,
    vehicleInfo: ride.riderInfo?.vehicle ? {
      model: ride.riderInfo.vehicle.vehicle_name,
      color: ride.riderInfo.vehicle.vehicle_colour,
    } : undefined,
    licensePlate: ride.riderInfo?.vehicle?.vehicle_no,
    driver: ride.riderInfo ? {
      id: ride.riderInfo.id,
      name: ride.riderInfo.name,
      rating: ride.riderInfo.averageRating,
      rideCount: ride.riderInfo.totalCompletedRides,
      image: ride.riderInfo.profile,
    } : undefined,
    dateTime: ride.scheduledAt || '',
    price: ride.agreedPrice,
    currency: getRideSharingCurrencyLabel(),
    status: mapApiStatus(ride.rideStatus),
    pickupAddress: ride.pickup.location,
    dropoffAddress: ride.dropoff.location,
    paymentMethod: ride.paymentVia as 'cash' | 'card',
    waitTime: '5 minutes of wait time included to meet your ride.',
    cancellationPolicy: 'Free cancellation up to 1 hour before pickup.',
  };
};
