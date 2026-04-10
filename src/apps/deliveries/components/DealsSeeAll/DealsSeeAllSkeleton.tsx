import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';

const SKELETON_ITEMS = 6;

type Props = {
  isTabsVisible?: boolean;
};

export default function DealsSeeAllSkeleton({
  isTabsVisible = true,
}: Props) {
  return (
    <View style={styles.container}>
      {isTabsVisible ? (
        <View style={styles.tabsRow}>
          <Skeleton width="20%" height={20} borderRadius={6} />
          <Skeleton width="34%" height={20} borderRadius={6} />
          <Skeleton width="24%" height={20} borderRadius={6} />
        </View>
      ) : null}
      <Skeleton width="100%" height={72} borderRadius={8} />
      <Skeleton width="52%" height={28} borderRadius={8} />
      <View style={styles.grid}>
        {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
          <View key={index} style={styles.card}>
            <Skeleton width="100%" height={150} borderRadius={14} />
            <Skeleton width="40%" height={16} borderRadius={6} />
            <Skeleton width="72%" height={22} borderRadius={6} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    marginBottom: 14,
    width: '48%',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
});
