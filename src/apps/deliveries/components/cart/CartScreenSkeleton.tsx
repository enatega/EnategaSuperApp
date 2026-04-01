import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Skeleton from '../../../../general/components/Skeleton';

export default function CartScreenSkeleton() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Skeleton borderRadius={20} height={40} width={40} />
        <Skeleton borderRadius={8} height={24} width={80} />
        <View style={styles.trailingSpace} />
      </View>

      <View style={styles.body}>
        <Skeleton borderRadius={10} height={46} width="100%" />
        <Skeleton borderRadius={8} height={28} width={110} />
        <Skeleton borderRadius={10} height={88} width="100%" />
        <Skeleton borderRadius={10} height={88} width="100%" />
        <Skeleton borderRadius={8} height={28} width={180} />
        <View style={styles.recommendationRow}>
          <Skeleton borderRadius={12} height={210} width={282} />
          <Skeleton borderRadius={12} height={210} width={282} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 20,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  recommendationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  trailingSpace: {
    width: 40,
  },
});
