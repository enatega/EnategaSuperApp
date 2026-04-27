import React, { memo, useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
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
}: Props) {
  const {
    currentCoordinates,
    isLoadingCurrentLocation,
    refreshCurrentLocation,
  } = useCurrentLocation();
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setLayoutHeight(event.nativeEvent.layout.height);
  }, []);

  const handleBottomSheetHeightChange = useCallback((height: number) => {
    setBottomSheetHeight((previousHeight) => {
      if (Math.abs(previousHeight - height) < 1) {
        return previousHeight;
      }

      return height;
    });
  }, []);

  const mapHeight = useMemo(() => {
    if (layoutHeight <= 0) {
      return null;
    }

    return Math.max(layoutHeight - bottomSheetHeight, 0);
  }, [bottomSheetHeight, layoutHeight]);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View
        style={[
          styles.mapContainer,
          mapHeight === null ? styles.mapContainerFallback : { height: mapHeight },
        ]}
      >
        <RideOptionsMapLayer
          currentCoordinates={currentCoordinates}
          cachedAddresses={cachedAddresses}
        />
      </View>
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
        onHeightChange={handleBottomSheetHeightChange}
      />
    </View>
  );
}

export default memo(RideOptionsLayout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  mapContainerFallback: {
    flex: 1,
  },
});
