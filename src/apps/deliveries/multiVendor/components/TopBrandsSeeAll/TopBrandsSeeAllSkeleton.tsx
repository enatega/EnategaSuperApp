import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

const SKELETON_ITEMS = 4;

export default function TopBrandsSeeAllSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
        <View key={index} style={styles.card}>
          <Skeleton width="100%" height={156} borderRadius={14} />
          <View style={styles.content}>
            <Skeleton width="58%" height={18} borderRadius={6} />
            <Skeleton width="42%" height={16} borderRadius={6} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    width: '48%',
  },
  content: {
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
