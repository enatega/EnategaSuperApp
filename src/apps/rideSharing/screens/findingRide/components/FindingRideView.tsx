import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { RideAddressSelection } from '../../../api/types';
import FindingRideBottomSheet from './FindingRideBottomSheet';
import FindingRideBidsList from './FindingRideBidsList';
import FindingRideMapLayer from './FindingRideMapLayer';
import useRideRoutePath from '../../../hooks/useRideRoutePath';
import { useTheme } from '../../../../../general/theme/theme';
import { useFindingRideController } from '../hooks/useFindingRideController';
import type { FindingRideViewProps } from '../types/view';
import { isCourierRideRequest } from '../../../utils/courierBooking';
import { useRideBidsStore } from '../../../stores/useRideBidsStore';

function toAddressSelection(
  requestId: string,
  kind: 'pickup' | 'dropoff',
  description: string,
  coordinates: { lat: number; lng: number },
): RideAddressSelection {
  return {
    placeId: `${requestId}:${kind}`,
    description,
    structuredFormatting: {
      mainText: description,
    },
    coordinates: {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    },
  };
}

function toCurrencyNumber(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const parsedValue = Number.parseFloat(value);
    return Number.isFinite(parsedValue) ? parsedValue : undefined;
  }

  return undefined;
}

export default function FindingRideView({
  activeRideRequest,
  ...props
}: FindingRideViewProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const bidsCount = useRideBidsStore((state) => state.bids.length);
  const fromAddress = toAddressSelection(
    activeRideRequest.id,
    'pickup',
    activeRideRequest.pickup_location,
    activeRideRequest.pickup,
  );
  const toAddress = toAddressSelection(
    activeRideRequest.id,
    'dropoff',
    activeRideRequest.dropoff_location,
    activeRideRequest.dropoff,
  );
  const selectedRide = {
    id: activeRideRequest.ride_type_id,
    title: activeRideRequest.ride_type?.name ?? 'Ride',
    icon: activeRideRequest.ride_type?.imageUrl ?? undefined,
    seats: activeRideRequest.ride_type?.seatCount,
    fare: toCurrencyNumber(activeRideRequest.offeredFair),
    recommendedFare: toCurrencyNumber(activeRideRequest.baseFair),
  };
  const isCourierFlow = isCourierRideRequest(selectedRide.title) || isCourierRideRequest(activeRideRequest.ride_type_id);
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const controller = useFindingRideController({
    activeRideRequest,
    fromAddress,
    toAddress,
    selectedRide,
    ...props,
  });

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
          fare: controller.currentFare,
          recommendedFare: controller.minimumFare,
        }}
        findingTitle={
          bidsCount > 0
            ? (isCourierFlow ? t('ride_finding_accept_courier_offer_title') : t('ride_finding_accept_driver_offer_title'))
            : (isCourierFlow ? t('ride_finding_courier_title') : t('ride_finding_driver_title'))
        }
        cancelLabel={isCourierFlow ? t('ride_finding_cancel_courier') : t('ride_finding_cancel')}
        fare={controller.currentFare}
        recommendedFare={controller.minimumFare}
        timeLeftSec={controller.timeLeftSec}
        onIncreaseFare={controller.handleIncreaseFare}
        onDecreaseFare={controller.handleDecreaseFare}
        isIncreaseDisabled={controller.isIncreaseDisabled}
        isDecreaseDisabled={controller.isDecreaseDisabled}
        onKeepSearching={controller.handleKeepSearching}
        isKeepSearchingLoading={controller.isKeepSearchingLoading}
        onCancelRide={controller.handleCancelRide}
        isCancelLoading={controller.isCancelLoading}
        floatingAccessory={(
          <FindingRideBidsList
            onAcceptBid={controller.handleAcceptBid}
            onDeclineBid={controller.handleDeclineBid}
            acceptingBidId={controller.acceptingBidId}
            decliningBidId={controller.decliningBidId}
            isInteractionLocked={controller.isBidInteractionLocked}
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
