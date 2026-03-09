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
  selectedCategory: RideCategory;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: () => void;
  onBackPress: () => void;
};

function RideOptionsLayout({
  rideOptions,
  cachedAddresses,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
  onBackPress,
}: Props) {
  const {
    currentCoordinates,
    isLoadingCurrentLocation,
    refreshCurrentLocation,
  } = useCurrentLocation();

  return (
    <View style={styles.container}>
      <RideOptionsMapLayer
        onBackPress={onBackPress}
        currentCoordinates={currentCoordinates}
        cachedAddresses={cachedAddresses}
      />
      <RideOptionsBottomSheet
        rideOptions={rideOptions}
        cachedAddresses={cachedAddresses}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onSearchPress={onSearchPress}
        onLocatePress={refreshCurrentLocation}
        isLocating={isLoadingCurrentLocation}
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
