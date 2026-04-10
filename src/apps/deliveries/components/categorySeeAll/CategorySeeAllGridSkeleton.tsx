import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';

const SKELETON_ITEMS = 9;

export default function CategorySeeAllGridSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton width={96} height={96} borderRadius={14} />
          <Skeleton width={84} height={16} borderRadius={6} />
          <Skeleton width={72} height={16} borderRadius={6} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 28,
    width: '31%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
});
