import { CustomerRide } from '../api/types';
import { Reservation, RideStatus } from '../types/reservation';

export const mapCustomerRideToReservation = (ride: CustomerRide): Reservation => {
  let status: RideStatus = 'scheduled';
  
  switch (ride.rideStatus) {
    case 'COMPLETED':
      status = 'completed';
      break;
    case 'CANCELLED':
      status = 'cancelled';
      break;
    case 'IN_PROGRESS':
      status = 'in_progress';
      break;
    case 'ASSIGNED':
    case 'SCHEDULED':
    default:
      status = 'scheduled';
      break;
  }

  return {
    id: ride.rideId,
    rideType: 'ride', // Defaulting to 'ride' as the API type structure is different
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
    dateTime: ride.scheduledAt || ride.createdAt,
    price: ride.agreedPrice,
    currency: 'QAR',
    status: status,
    pickupAddress: ride.pickup.location,
    dropoffAddress: ride.dropoff.location,
    paymentMethod: ride.paymentVia as 'cash' | 'card',
    waitTime: '5 minutes of wait time included to meet your ride.',
    cancellationPolicy: 'Free cancellation up to 1 hour before pickup.',
  };
};
