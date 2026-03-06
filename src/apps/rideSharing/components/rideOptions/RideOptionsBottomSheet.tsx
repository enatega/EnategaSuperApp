import React, { memo } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import { RideCategory } from '../../utils/rideOptions';
import { CachedAddress, RideOptionItem } from './types';
import RideOptionsHeader from './RideOptionsHeader';
import CachedAddressList from './CachedAddressList';

type Props = {
  rideOptions: RideOptionItem[];
  cachedAddresses: CachedAddress[];
  selectedCategory: RideCategory;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: () => void;
};

function RideOptionsBottomSheet({
  rideOptions,
  cachedAddresses,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const expandedHeight = Math.min(screenHeight * 0.6, 520);
  const collapsedHeight = 120;

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
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
      <CachedAddressList
        data={cachedAddresses}
        contentContainerStyle={styles.sheetContent}
        ListHeaderComponent={(
          <RideOptionsHeader
            rideOptions={rideOptions}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            onSearchPress={onSearchPress}
          />
        )}
      />
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
});
