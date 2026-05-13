import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { RideAddressSelection } from '../../../api/types';
import RideEstimateMapLayer from '../../rideEstimate/components/RideEstimateMapLayer';
import FindingRideAnimation from '../../../../../general/components/FindingRideAnimation';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  fromAddress: RideAddressSelection;
  stopAddresses?: RideAddressSelection[];
  toAddress: RideAddressSelection;
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
  searchRadiusKm: number;
};

function FindingRideMapLayer({
  fromAddress,
  stopAddresses = [],
  toAddress,
  routeCoordinates,
  searchRadiusKm,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill}>
      <RideEstimateMapLayer
        fromAddress={fromAddress}
        stopAddresses={stopAddresses}
        toAddress={toAddress}
        routeCoordinates={routeCoordinates}
        searchRadiusKm={searchRadiusKm}
        isInteractionEnabled={false}
      />
      <View
        pointerEvents="none"
        style={[styles.overlay, { backgroundColor: colors.findingRideMapOverlay }]}
      />
      <View pointerEvents="box-none" style={styles.animationWrap}>
        <FindingRideAnimation />
      </View>
    </View>
  );
}

export default memo(FindingRideMapLayer);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  animationWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '27%',
    alignItems: 'center',
  },
});
