import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import { RideCategory } from '../../utils/rideOptions';
import { RecentLocation, RideOptionItem } from './types';
import RideOptionsHeader from './RideOptionsHeader';
import RecentLocationRow from './RecentLocationRow';

type Props = {
  rideOptions: RideOptionItem[];
  recentLocations: RecentLocation[];
  selectedCategory: RideCategory;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: () => void;
};

function RideOptionsBottomSheet({
  rideOptions,
  recentLocations,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderLocation = useCallback(
    ({ item }: ListRenderItemInfo<RecentLocation>) => (
      <RecentLocationRow item={item} />
    ),
    [],
  );

  return (
    <View
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

      <FlatList
        data={recentLocations}
        keyExtractor={(item) => item.id}
        renderItem={renderLocation}
        showsVerticalScrollIndicator={false}
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
    </View>
  );
}

export default memo(RideOptionsBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  sheetContent: {
    paddingBottom: 12,
  },
});
