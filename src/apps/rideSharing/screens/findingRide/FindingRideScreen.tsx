import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RideAddressSelection } from '../../api/types';
import type { RideOptionItem } from '../../components/rideOptions/types';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import FindingRideMapLayer from './components/FindingRideMapLayer';
import FindingRideBottomSheet from './components/FindingRideBottomSheet';
import useRideRoutePath from '../../hooks/useRideRoutePath';
import { useTheme } from '../../../../general/theme/theme';

type RouteParams = {
  fromAddress: RideAddressSelection;
  toAddress: RideAddressSelection;
  selectedRide: RideOptionItem & {
    fare?: number;
    recommendedFare?: number;
  };
  offeredFare?: number;
  recommendedFare?: number;
};

const SEARCH_DURATION_SECONDS = 60;

export default function FindingRideScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute();
  const { colors } = useTheme();
  const {
    fromAddress,
    toAddress,
    selectedRide,
    offeredFare,
    recommendedFare,
  } = route.params as RouteParams;
  const routeQuery = useRideRoutePath(fromAddress, toAddress);
  const minimumFare = recommendedFare ?? selectedRide.recommendedFare ?? selectedRide.fare ?? 0;
  const [currentFare, setCurrentFare] = useState<number>(offeredFare ?? minimumFare);
  const [timeLeftSec, setTimeLeftSec] = useState(SEARCH_DURATION_SECONDS);

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
        onCancelRide={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
