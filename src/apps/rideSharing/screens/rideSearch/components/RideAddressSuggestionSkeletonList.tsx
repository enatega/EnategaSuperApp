import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

function RideAddressSuggestionSkeletonList() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 5 }).map((_, index) => (
        <View key={index} style={styles.row}>
          <Skeleton width={16} height={16} borderRadius={8} style={styles.icon} />
          <View style={styles.textWrap}>
            <Skeleton width="72%" height={14} borderRadius={7} />
            <Skeleton width="48%" height={10} borderRadius={5} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default memo(RideAddressSuggestionSkeletonList);

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  textWrap: {
    flex: 1,
    gap: 8,
  },
});
