import type { RideAddressSelection } from '../../../api/types';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import type { FindingRideBid } from './bids';

export type FindingRideViewData = {
  rideRequestId?: string;
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  selectedRide: RideOptionItem & {
    fare?: number;
    recommendedFare?: number;
  };
  offeredFare?: number;
  recommendedFare?: number;
  bids?: FindingRideBid[];
};

export type FindingRideViewProps = FindingRideViewData & {
  onCancelSuccess?: () => void;
};
