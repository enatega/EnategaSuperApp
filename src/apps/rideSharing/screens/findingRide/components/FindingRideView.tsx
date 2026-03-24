import React from 'react';
import { StyleSheet, View } from 'react-native';
import FindingRideBottomSheet from './FindingRideBottomSheet';
import FindingRideBidsList from './FindingRideBidsList';
import FindingRideMapLayer from './FindingRideMapLayer';
import useRideRoutePath from '../../../hooks/useRideRoutePath';
import { useTheme } from '../../../../../general/theme/theme';
import { useFindingRideController } from '../hooks/useFindingRideController';
import type { FindingRideViewProps } from '../types/view';

export default function FindingRideView({
  fromAddress,
  toAddress,
  selectedRide,
  ...props
}: FindingRideViewProps) {
  const { colors } = useTheme();
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const controller = useFindingRideController({
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
