import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { RideAddressSelection } from '../../../api/types';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import FindingRideMapLayer from './FindingRideMapLayer';
import FindingRideBottomSheet from './FindingRideBottomSheet';
import FindingRideBidsList from './FindingRideBidsList';
import useRideRoutePath from '../../../hooks/useRideRoutePath';
import { useTheme } from '../../../../../general/theme/theme';
import { useCancelRideRequest } from '../../../hooks/useRideMutations';
import { useActiveRideRequestStore } from '../../../stores/useActiveRideRequestStore';
import { useRideBidsStore } from '../../../stores/useRideBidsStore';
import { showToast } from '../../../../../general/components/AppToast';
import { getApiErrorMessage } from '../../../../../general/utils/apiError';
import type { FindingRideBid } from '../types/bids';

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

type Props = FindingRideViewData & {
  onCancelSuccess?: () => void;
};

const SEARCH_DURATION_SECONDS = 60;

export default function FindingRideView({
  rideRequestId,
  fromAddress,
  toAddress,
  selectedRide,
  offeredFare,
  recommendedFare,
  bids: incomingBids,
  onCancelSuccess,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const activeRideRequestId = useActiveRideRequestStore((state) => state.activeRideRequest?.id);
  const clearActiveRideRequest = useActiveRideRequestStore((state) => state.clearActiveRideRequest);
  const cancelRideRequestMutation = useCancelRideRequest();
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const minimumFare = recommendedFare ?? selectedRide.recommendedFare ?? selectedRide.fare ?? 0;
  const [currentFare, setCurrentFare] = useState<number>(offeredFare ?? minimumFare);
  const [timeLeftSec, setTimeLeftSec] = useState(SEARCH_DURATION_SECONDS);
  const resolvedRideRequestId = rideRequestId ?? activeRideRequestId;
  const setBids = useRideBidsStore((state) => state.setBids);
  const clearBids = useRideBidsStore((state) => state.clearBids);

  useEffect(() => {
    setCurrentFare(offeredFare ?? minimumFare);
  }, [minimumFare, offeredFare]);

  useEffect(() => {
    if (timeLeftSec <= 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setTimeLeftSec((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSec]);

  useEffect(() => {
    if (incomingBids) {
      setBids(incomingBids);
    }
  }, [incomingBids, setBids]);


  const handleCancelRide = async () => {
    if (!resolvedRideRequestId || cancelRideRequestMutation.isPending) {
      return;
    }

    try {
      await cancelRideRequestMutation.mutateAsync(resolvedRideRequestId);
      clearBids();
      clearActiveRideRequest();
      onCancelSuccess?.();
    } catch (error) {
      showToast.error(t('error'), getApiErrorMessage(error, t('ride_estimate_quote_error_description')));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FindingRideMapLayer
        fromAddress={fromAddress}
        toAddress={toAddress}
        routeCoordinates={routeQuery.data ?? []}
      />
      <FindingRideBottomSheet
        selectedRide={{
          ...selectedRide,
          fare: currentFare,
          recommendedFare: minimumFare,
        }}
        fare={currentFare}
        recommendedFare={minimumFare}
        timeLeftSec={timeLeftSec}
        onIncreaseFare={() => {
          setCurrentFare((previous) => Number((previous + 1).toFixed(2)));
        }}
        onDecreaseFare={() => {
          setCurrentFare((previous) => Number(Math.max(minimumFare, previous - 1).toFixed(2)));
        }}
        isDecreaseDisabled={currentFare <= minimumFare}
        onKeepSearching={() => setTimeLeftSec(SEARCH_DURATION_SECONDS)}
        onCancelRide={handleCancelRide}
        isCancelLoading={cancelRideRequestMutation.isPending}
        floatingAccessory={(
          <FindingRideBidsList
            onAcceptBid={(bid) => setCurrentFare(bid.amount)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
