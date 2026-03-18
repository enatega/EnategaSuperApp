import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../../../general/components/HorizontalList';
import Skeleton from '../../../../../../general/components/Skeleton';

const SKELETON_ITEMS = Array.from({ length: 4 }, (_, index) => ({
  id: `store-mini-card-skeleton-${index}`,
}));

export default function StoreMiniCardSkeleton() {
  return (
    <HorizontalList
      data={SKELETON_ITEMS}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={() => (
        <View style={styles.card}>
          <View style={styles.imageWrapper}>
            <Skeleton height={140} width="100%" borderRadius={0} />
            <Skeleton height={24} width={72} borderRadius={6} style={styles.badge} />
            <Skeleton height={32} width={32} borderRadius={16} style={styles.addButton} />
          </View>

          <View style={styles.content}>
            <Skeleton height={15} width="42%" borderRadius={4} />
            <Skeleton height={18} width="82%" borderRadius={4} />
            <Skeleton height={15} width="58%" borderRadius={4} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 160,
  },
  imageWrapper: {
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  badge: {
    left: 8,
    position: 'absolute',
    top: 8,
  },
  addButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  content: {
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
