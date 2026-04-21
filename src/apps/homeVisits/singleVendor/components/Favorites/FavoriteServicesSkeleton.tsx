import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

export default function FavoriteServicesSkeleton() {
  return (
    <View style={styles.list}>
      <View style={styles.card}>
        <Skeleton borderRadius={8} height={140} width="100%" />
        <View style={styles.content}>
          <Skeleton height={18} width="60%" />
          <Skeleton height={14} width="45%" />
          <Skeleton height={1} width="100%" />
          <Skeleton height={14} width="70%" />
        </View>
      </View>

      <View style={styles.card}>
        <Skeleton borderRadius={8} height={140} width="100%" />
        <View style={styles.content}>
          <Skeleton height={18} width="55%" />
          <Skeleton height={14} width="40%" />
          <Skeleton height={1} width="100%" />
          <Skeleton height={14} width="65%" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  content: {
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  list: {
    gap: 12,
  },
});
