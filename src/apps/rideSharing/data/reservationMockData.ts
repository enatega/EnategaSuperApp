import type { Reservation } from '../types/reservation';

export const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    rideType: 'ride',
    rideTitle: 'Ride',
    vehicleInfo: {
      model: 'Honda 720N',
      color: 'Red',
    },
    licensePlate: 'NJ - K47 MPL',
    driver: {
      name: 'Jhon Smith',
      rating: 4.89,
      rideCount: 502,
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    dateTime: '2024-10-05T16:12:00Z',
    price: 48.75,
    currency: 'QAR',
    status: 'scheduled',
    pickupAddress: '1001 Parsippany Boulevard, Troy Hills',
    dropoffAddress: '445 Vreeland Avenue, Troy Hills',
    paymentMethod: 'cash',
    waitTime: '5 minutes of wait time included to meet your ride.',
    cancellationPolicy: 'Free cancellation up to 1 hour before pickup.',
  },
  {
    id: '2',
    rideType: 'women_ride',
    rideTitle: 'Women ride',
    vehicleInfo: {
      model: 'Toyota Camry',
      color: 'Pink',
    },
    licensePlate: 'NJ - W89 XYZ',
    dateTime: '2024-10-01T01:42:00Z',
    price: 62.4,
    currency: 'QAR',
    status: 'completed',
    pickupAddress: '789 Main Street, Dover',
    dropoffAddress: '456 Oak Avenue, Morristown',
    paymentMethod: 'card',
    waitTime: '5 minutes of wait time included to meet your ride.',
    cancellationPolicy: 'Free cancellation up to 1 hour before pickup.',
  },
  {
    id: '3',
    rideType: 'ride',
    rideTitle: 'Ride',
    vehicleInfo: {
      model: 'Nissan Altima',
      color: 'White',
    },
    licensePlate: 'NJ - A12 BCD',
    dateTime: '2024-09-24T20:19:00Z',
    price: 53.2,
    currency: 'QAR',
    status: 'cancelled',
    pickupAddress: '321 Pine Road, Parsippany',
    dropoffAddress: '654 Elm Street, Wayne',
    paymentMethod: 'cash',
    waitTime: '5 minutes of wait time included to meet your ride.',
    cancellationPolicy: 'Free cancellation up to 1 hour before pickup.',
  },
  {
    id: '4',
    rideType: 'premium_ride',
    rideTitle: 'Premium ride',
    vehicleInfo: {
      model: 'BMW 5 Series',
      color: 'Black',
    },
    licensePlate: 'NJ - P78 EFG',
    dateTime: '2024-09-13T14:02:00Z',
    price: 59.99,
    currency: 'QAR',
    status: 'completed',
    pickupAddress: '555 Luxury Lane, Princeton',
    dropoffAddress: '777 Executive Drive, Trenton',
    paymentMethod: 'card',
    waitTime: '10 minutes of complimentary wait time.',
    cancellationPolicy: 'Free cancellation up to 2 hours before pickup.',
  },
];

export const getReservationById = (id: string): Reservation | undefined => {
  return MOCK_RESERVATIONS.find((reservation) => reservation.id === id);
};

export const getUpcomingReservations = (): Reservation[] => {
  return MOCK_RESERVATIONS.filter(
    (reservation) => reservation.status === 'scheduled',
  );
};

export const getPastReservations = (): Reservation[] => {
  return MOCK_RESERVATIONS.filter(
    (reservation) => reservation.status !== 'scheduled',
  );
};
