import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import Skeleton from '../../../../general/components/Skeleton';

const SKELETON_ITEMS = Array.from({ length: 3 }, (_, index) => ({
  id: `discovery-results-skeleton-${index}`,
}));

export default function DiscoveryResultsSkeleton() {
  return (
    <HorizontalList
      data={SKELETON_ITEMS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={() => (
        <View style={styles.card}>
          <Skeleton height={160} borderRadius={12} />
          <View style={styles.content}>
            <Skeleton height={18} width="70%" />
            <Skeleton height={14} width="55%" />
            <Skeleton height={1} width="100%" />
            <Skeleton height={14} width="85%" />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 280,
  },
  content: {
    gap: 10,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
