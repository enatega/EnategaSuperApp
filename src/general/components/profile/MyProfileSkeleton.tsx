import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../Skeleton';

export default function MyProfileSkeleton() {
  return (
    <View style={styles.container}>
      {/* Info card skeleton */}
      <View style={styles.cardWrapper}>
        <Skeleton width="100%" height={320} borderRadius={8} />
      </View>

      {/* Addresses section skeleton */}
      <View style={styles.addressSection}>
        <Skeleton width={120} height={20} borderRadius={4} />
        <Skeleton width="100%" height={72} borderRadius={8} />
        <Skeleton width="100%" height={72} borderRadius={8} />
        <Skeleton width="100%" height={48} borderRadius={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addressSection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    paddingHorizontal: 16,
  },
  container: {
    gap: 24,
    paddingTop: 16,
  },
});
