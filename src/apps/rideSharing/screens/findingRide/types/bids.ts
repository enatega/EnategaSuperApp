export type FindingRideBid = {
  id: string;
  driverName: string;
  driverRides?: number;
  driverAvatarUri?: string;
  vehicleLabel?: string;
  etaMin?: number;
  distanceKm?: number;
  rating?: number;
  amount: number;
};
