import React, { memo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import MapCurrentLocationButton from '../../../../general/components/MapCurrentLocationButton';
import { RideCategory } from '../../utils/rideOptions';
import { CachedAddress, RideOptionItem } from './types';
import RideOptionsHeader from './RideOptionsHeader';
import CachedAddressList from './CachedAddressList';
import RideOptionsBottomSheetSkeleton from './RideOptionsBottomSheetSkeleton';
import RideOptionsBottomSheetError from './RideOptionsBottomSheetError';

type Props = {
  rideOptions: RideOptionItem[];
  cachedAddresses: CachedAddress[];
  selectedCategory: RideCategory | null;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: (address?: CachedAddress) => void;
  onLocatePress: () => void;
  isLocating?: boolean;
  isLoadingRideTypes?: boolean;
  rideTypesErrorMessage?: string | null;
  onRetryRideTypes?: () => void;
};

function RideOptionsBottomSheet({
  rideOptions,
  cachedAddresses,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
  onLocatePress,
  isLocating = false,
  isLoadingRideTypes = false,
  rideTypesErrorMessage = null,
  onRetryRideTypes,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const expandedHeight = Math.min(screenHeight * 0.6, 520);
  const collapsedHeight = 120;
  const showErrorState = Boolean(rideTypesErrorMessage) && !isLoadingRideTypes;
  const searchDisabled = !selectedCategory || isLoadingRideTypes || showErrorState;

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      floatingAccessory={(
        <MapCurrentLocationButton
          label={t('ride_current_location')}
          onPress={onLocatePress}
          isLoading={isLocating}
        />
      )}
      floatingAccessoryStyle={styles.locateFloatingButton}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />}
      handleContainerStyle={styles.handleContainer}
    >
      {isLoadingRideTypes ? (
        <RideOptionsBottomSheetSkeleton />
      ) : showErrorState ? (
        <RideOptionsBottomSheetError
          message={rideTypesErrorMessage}
          onRetry={onRetryRideTypes}
        />
      ) : (
        <CachedAddressList
          data={cachedAddresses}
          onSelect={onSearchPress}
          contentContainerStyle={styles.sheetContent}
          ListHeaderComponent={(
            <RideOptionsHeader
              rideOptions={rideOptions}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onSearchPress={onSearchPress}
              searchDisabled={searchDisabled}
            />
          )}
        />
      )}
    </SwipeableBottomSheet>
  );
}

export default memo(RideOptionsBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  sheetContent: {
    paddingBottom: 12,
  },
  locateFloatingButton: {
    right: 16,
    top: -54,
  },
});
