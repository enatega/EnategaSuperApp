import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../../general/components/Skeleton';
import { useTheme } from '../../../../../../general/theme/theme';

const SKELETON_ITEMS = Array.from({ length: 4 }, (_, index) => ({
  id: `vertical-store-skeleton-${index}`,
}));

export default function VerticalStoreListSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={styles.listContent}>
      {SKELETON_ITEMS.map((item, index) => (
        <React.Fragment key={item.id}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <View style={styles.imageContainer}>
              <Skeleton height={160} width="100%" borderRadius={0} />
              <Skeleton
                height={28}
                width={88}
                borderRadius={18}
                style={styles.badge}
              />
              <Skeleton
                height={32}
                width={32}
                borderRadius={16}
                style={styles.actionButton}
              />
            </View>

            <View style={styles.content}>
              <Skeleton height={18} width="60%" borderRadius={5} />

              <View style={styles.metaRow}>
                <Skeleton height={14} width={52} borderRadius={4} />
                <Skeleton height={14} width={64} borderRadius={4} />
                <Skeleton height={14} width={88} borderRadius={4} />
              </View>

              <Skeleton
                height={1}
                width="100%"
                borderRadius={1}
                style={styles.divider}
              />

              <View style={styles.metaRow}>
                <Skeleton height={14} width={58} borderRadius={4} />
                <Skeleton height={14} width={74} borderRadius={4} />
                <Skeleton height={14} width={62} borderRadius={4} />
              </View>
            </View>
          </View>
          {index < SKELETON_ITEMS.length - 1 ? <View style={styles.separator} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  badge: {
    left: 12,
    position: 'absolute',
    top: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    gap: 10,
    padding: 8,
  },
  divider: {
    marginVertical: 2,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
    width: '100%',
  },
  listContent: {
    paddingBottom: 24,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  separator: {
    height: 12,
  },
});
