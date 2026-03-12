import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

export default function TopBrandsListSkeleton() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((item) => (
        <View key={item} style={styles.card}>
          <Skeleton
            width={styles.imageWrap.width}
            height={styles.imageWrap.height}
            borderRadius={styles.imageWrap.borderRadius}
          >
            <View style={styles.imageContainer}>
              <Skeleton width={76} height={76} borderRadius={10} />
            </View>
          </Skeleton>

          <View style={styles.content}>
            <Skeleton width={64} height={14} borderRadius={7} />
            <Skeleton width={52} height={14} borderRadius={7} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    borderRadius: 8,
    gap: 0,
    height: 140,
    overflow: 'hidden',
    width: 100,
  },
  imageWrap: {
    borderRadius: 8,
    height: 100,
    width: 100,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    gap: 4,
    paddingHorizontal: 6,
    paddingTop: 8,
  },
});
