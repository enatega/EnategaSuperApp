import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { RideAddressSelection } from '../../../api/types';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import FindingRideMapLayer from './FindingRideMapLayer';
import FindingRideBottomSheet from './FindingRideBottomSheet';
import FindingRideBidsList from './FindingRideBidsList';
import useRideRoutePath from '../../../hooks/useRideRoutePath';
import { useTheme } from '../../../../../general/theme/theme';
import { useCancelRide } from '../../../hooks/useRideMutations';
import { useRideBidSocket } from '../../../hooks/useRideBidSocket';
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
  const cancelRideMutation = useCancelRide();
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const minimumFare = recommendedFare ?? selectedRide.recommendedFare ?? selectedRide.fare ?? 0;
  const [currentFare, setCurrentFare] = useState<number>(offeredFare ?? minimumFare);
  const [timeLeftSec, setTimeLeftSec] = useState(SEARCH_DURATION_SECONDS);
  const resolvedRideRequestId = rideRequestId ?? activeRideRequestId;
  const setBids = useRideBidsStore((state) => state.setBids);
  const storedBidsCount = useRideBidsStore((state) => state.bids.length);
  useRideBidSocket();
  const fallbackBids = useMemo<FindingRideBid[]>(() => {
    return [
      {
        id: 'bid-1',
        driverName: 'Jhon',
        driverRides: 2713,
        driverAvatarUri: 'https://i.pravatar.cc/84?img=12',
        vehicleLabel: 'Toyota Camry',
        etaMin: 10,
        distanceKm: 8.2,
        rating: 4.9,
        amount: 30.1,
      },
      {
        id: 'bid-2',
        driverName: 'Alice',
        driverRides: 3105,
        driverAvatarUri: 'https://i.pravatar.cc/84?img=49',
        vehicleLabel: 'BWM 320',
        etaMin: 8,
        distanceKm: 7.5,
        rating: 4.75,
        amount: 28.5,
      },
      {
        id: 'bid-3',
        driverName: 'Mike',
        driverRides: 1845,
        driverAvatarUri: 'https://i.pravatar.cc/84?img=14',
        vehicleLabel: 'Suzuki Boulevard',
        etaMin: 5,
        distanceKm: 5.8,
        rating: 4.95,
        amount: 32,
      },
    ];
  }, []);

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
    if (incomingBids && incomingBids.length) {
      setBids(incomingBids);
      return;
    }

    if (storedBidsCount === 0) {
      setBids(fallbackBids);
    }
  }, [fallbackBids, incomingBids, setBids, storedBidsCount]);

  const handleCancelRide = async () => {
    if (!resolvedRideRequestId || cancelRideMutation.isPending) {
      return;
    }

    try {
      await cancelRideMutation.mutateAsync(resolvedRideRequestId);
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
        isCancelLoading={cancelRideMutation.isPending}
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
