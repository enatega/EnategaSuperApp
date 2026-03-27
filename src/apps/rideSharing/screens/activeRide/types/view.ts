import type { ActiveRidePayload } from '../../../api/types';

export type CompletedRideFeedbackData = {
  rideId: string;
  driverUserId?: string;
  driverName?: string;
  driverAvatarUri?: string;
  rawRideData?: ActiveRidePayload;
};
