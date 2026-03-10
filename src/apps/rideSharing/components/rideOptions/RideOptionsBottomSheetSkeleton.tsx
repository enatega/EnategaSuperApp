import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';

function RideOptionsBottomSheetSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.skeletonRow}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.skeletonCard}>
            <Skeleton width={88} height={28} borderRadius={8} />
            <View style={styles.skeletonMeta}>
              <Skeleton width={56} height={14} borderRadius={6} />
              <Skeleton width={24} height={14} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
      <Skeleton
        width="auto"
        height={44}
        borderRadius={8}
        style={styles.searchSkeleton}
      />
      <View style={styles.addressSkeletonList}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.addressSkeletonRow}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <View style={styles.addressSkeletonMeta}>
              <Skeleton width={136} height={14} borderRadius={6} />
              <Skeleton width={96} height={10} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default memo(RideOptionsBottomSheetSkeleton);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  skeletonCard: {
    width: 112,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
  },
  skeletonMeta: {
    gap: 6,
  },
  searchSkeleton: {
    marginHorizontal: 16,
    marginTop: 4,
  },
  addressSkeletonList: {
    paddingTop: 20,
    gap: 16,
    paddingHorizontal: 16,
  },
  addressSkeletonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressSkeletonMeta: {
    gap: 8,
    flex: 1,
  },
});
