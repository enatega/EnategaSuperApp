import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../../general/components/Skeleton';

function Card() {
  return (
    <View style={styles.card}>
      <Skeleton
        width={styles.imageWrap.width}
        height={styles.imageWrap.height}
        borderRadius={styles.imageWrap.borderRadius}
      >
        <View style={styles.imageContainer}>
          <Skeleton
            width={styles.image.width}
            height={styles.image.height}
            borderRadius={styles.image.borderRadius}
          />
        </View>
      </Skeleton>

      <Skeleton width={72} height={14} borderRadius={7} />
      <Skeleton width={56} height={14} borderRadius={7} />
    </View>
  );
}

export default function ShopTypeCardSkeleton() {
  return (
    <View style={styles.container}>
      <Card />
      <Card />
      <Card />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // 👈 makes items horizontal
    gap: 16,
  },
  card: {
    alignItems: 'center',
    gap: 10,
    width: 96,
  },
  imageWrap: {
    borderRadius: 12,
    height: 96,
    width: 96,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    borderRadius: 10,
    height: 66,
    width: 66,
  },
});