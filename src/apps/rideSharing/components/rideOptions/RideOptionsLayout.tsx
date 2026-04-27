import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { RideCategory } from '../../utils/rideOptions';
import RideOptionsBottomSheet from './RideOptionsBottomSheet';
import RideOptionsMapLayer from './RideOptionsMapLayer';
import { CachedAddress, RideOptionItem } from './types';
import useCurrentLocation from '../../../../general/hooks/useCurrentLocation';

type Props = {
  rideOptions: RideOptionItem[];
  cachedAddresses: CachedAddress[];
  selectedCategory: RideCategory | null;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: (address?: CachedAddress) => void;
  onBackPress: () => void;
  isLoadingRideTypes?: boolean;
  rideTypesErrorMessage?: string | null;
  onRetryRideTypes?: () => void;
  enableNearbyDrivers?: boolean;
};

function RideOptionsLayout({
  rideOptions,
  cachedAddresses,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
  onBackPress,
  isLoadingRideTypes = false,
  rideTypesErrorMessage = null,
  onRetryRideTypes,
  enableNearbyDrivers = true,
}: Props) {
  const {
    currentCoordinates,
    isLoadingCurrentLocation,
    refreshCurrentLocation,
  } = useCurrentLocation();

  return (
    <View style={styles.container}>
      <RideOptionsMapLayer
        currentCoordinates={currentCoordinates}
        cachedAddresses={cachedAddresses}
        enableNearbyDrivers={enableNearbyDrivers}
      />
      <RideOptionsBottomSheet
        rideOptions={rideOptions}
        cachedAddresses={cachedAddresses}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onBackPress={onBackPress}
        onSearchPress={onSearchPress}
        onLocatePress={refreshCurrentLocation}
        isLocating={isLoadingCurrentLocation}
        isLoadingRideTypes={isLoadingRideTypes}
        rideTypesErrorMessage={rideTypesErrorMessage}
        onRetryRideTypes={onRetryRideTypes}
      />
    </View>
  );
}

export default memo(RideOptionsLayout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
