import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

const SKELETON_ROWS = Array.from({ length: 6 }, (_, index) => ({
  id: `home-visits-booking-skeleton-${index}`,
}));

export default function BookingsListSkeleton() {
  return (
    <View style={styles.container}>
      {SKELETON_ROWS.map((row) => (
        <View key={row.id} style={styles.row}>
          <Skeleton borderRadius={8} height={49} width={56} />
          <View style={styles.textContent}>
            <Skeleton height={16} width="75%" />
            <Skeleton height={12} width="90%" />
          </View>
          <Skeleton borderRadius={8} height={32} width={106} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    rowGap: 12,
  },
  row: {
    alignItems: 'center',
    columnGap: 12,
    flexDirection: 'row',
    paddingVertical: 12,
  },
  textContent: {
    flex: 1,
    rowGap: 8,
  },
});
