import type { ActiveRideRequestPayload } from '../../../api/types';
import type { FindingRideBid } from './bids';

export type FindingRideViewProps = {
  activeRideRequest: ActiveRideRequestPayload;
  bids?: FindingRideBid[];
  onCancelSuccess?: () => void;
};
