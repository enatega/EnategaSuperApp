export type FindingRideBid = {
  id: string;
  driverName: string;
  driverId?: string;
  driverRides?: number;
  driverAvatarUri?: string;
  vehicleLabel?: string;
  etaMin?: number;
  distanceKm?: number;
  rating?: number;
  amount: number;
  status?: string;
  createdAt?: string;
  expiresAt?: string;
  remainingTimeMs?: number;
};
