import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { RideCategory } from '../../utils/rideOptions';
import RideOptionsBottomSheet from './RideOptionsBottomSheet';
import RideOptionsMapLayer from './RideOptionsMapLayer';
import { RecentLocation, RideOptionItem } from './types';

type Props = {
  rideOptions: RideOptionItem[];
  recentLocations: RecentLocation[];
  selectedCategory: RideCategory;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: () => void;
  onBackPress: () => void;
};

function RideOptionsLayout({
  rideOptions,
  recentLocations,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
  onBackPress,
}: Props) {
  return (
    <View style={styles.container}>
      <RideOptionsMapLayer onBackPress={onBackPress} />
      <RideOptionsBottomSheet
        rideOptions={rideOptions}
        recentLocations={recentLocations}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        onSearchPress={onSearchPress}
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
