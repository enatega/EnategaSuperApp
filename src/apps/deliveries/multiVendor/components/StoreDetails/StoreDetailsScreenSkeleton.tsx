import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';
import { useTheme } from '../../../../../general/theme/theme';

export default function StoreDetailsScreenSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Skeleton height={240} width="100%" borderRadius={0} />

      <View style={styles.content}>
        <Skeleton height={88} width={88} borderRadius={12} />
        <Skeleton height={24} width="60%" borderRadius={6} />
        <Skeleton height={18} width="80%" borderRadius={6} />
        <Skeleton height={46} width="100%" borderRadius={12} />
        <Skeleton height={44} width="100%" borderRadius={0} />
        <Skeleton height={180} width="100%" borderRadius={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
});
