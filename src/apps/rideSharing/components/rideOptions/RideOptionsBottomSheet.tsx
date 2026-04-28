import React, { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import MapCurrentLocationButton from '../../../../general/components/MapCurrentLocationButton';
import Icon from '../../../../general/components/Icon';
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
  onBackPress: () => void;
  onSearchPress: (address?: CachedAddress) => void;
  onLocatePress: () => void;
  isLocating?: boolean;
  isLoadingRideTypes?: boolean;
  rideTypesErrorMessage?: string | null;
  onRetryRideTypes?: () => void;
  onHeightChange?: (height: number) => void;
  isDirectCourierFlow?: boolean;
};

function RideOptionsBottomSheet({
  rideOptions,
  cachedAddresses,
  selectedCategory,
  onSelectCategory,
  onBackPress,
  onSearchPress,
  onLocatePress,
  isLocating = false,
  isLoadingRideTypes = false,
  rideTypesErrorMessage = null,
  onRetryRideTypes,
  onHeightChange,
  isDirectCourierFlow = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const expandedHeight = isDirectCourierFlow
    ? Math.min(screenHeight * 0.8, screenHeight - 32)
    : Math.min(screenHeight * 0.6, 520);
  const defaultHeight = isDirectCourierFlow
    ? expandedHeight
    : undefined;
  const collapsedHeight = 120;
  const showErrorState = Boolean(rideTypesErrorMessage) && !isLoadingRideTypes;
  const searchDisabled = !selectedCategory || isLoadingRideTypes || showErrorState;

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      defaultHeight={defaultHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      floatingAccessory={(
        <View style={styles.floatingAccessoryContent}>
          <Pressable
            onPress={onBackPress}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon type="Ionicons" name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <MapCurrentLocationButton
            label={t('ride_current_location')}
            onPress={onLocatePress}
            isLoading={isLocating}
          />
        </View>
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
      handle={<BottomSheetHandle color={colors.border} />}
      onHeightChange={onHeightChange}
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
              hideOptionsRow={isDirectCourierFlow}
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
    left: 16,
    right: 16,
    top: -54,
  },
  floatingAccessoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
