import React from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Skeleton from '../../../../general/components/Skeleton';
import { useTheme } from '../../../../general/theme/theme';

export default function OrderDetailsLoadingSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title="" />
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Skeleton height={16} width="38%" />
          <Skeleton height={34} width="82%" />
        </View>

        <Skeleton height={1} width="100%" />

        <View style={styles.section}>
          <Skeleton height={24} width="42%" />
          <Skeleton height={26} width={88} borderRadius={6} />
          <Skeleton height={18} width="70%" />
        </View>

        <Skeleton height={1} width="100%" />

        <View style={styles.section}>
          <Skeleton height={24} width="48%" />
          <Skeleton height={18} width="58%" />
        </View>

        <Skeleton height={1} width="100%" />

        <View style={styles.section}>
          <Skeleton height={24} width="36%" />
          <View style={styles.productRow}>
            <Skeleton height={50} width={56} />
            <View style={styles.productText}>
              <Skeleton height={16} width="55%" />
              <Skeleton height={14} width="92%" />
              <Skeleton height={14} width="35%" />
            </View>
          </View>
        </View>

        <Skeleton height={1} width="100%" />

        <View style={styles.section}>
          <Skeleton height={24} width="44%" />
          <Skeleton height={16} width="55%" />
          <Skeleton height={18} width="100%" />
          <Skeleton height={18} width="100%" />
          <Skeleton height={18} width="100%" />
          <Skeleton height={18} width="100%" />
          <Skeleton height={1} width="100%" />
          <Skeleton height={20} width="100%" />
        </View>

        <Skeleton height={1} width="100%" />

        <View style={styles.section}>
          <Skeleton height={24} width="46%" />
          <Skeleton height={18} width="100%" />
          <Skeleton height={44} width="100%" borderRadius={10} />
          <Skeleton height={44} width="100%" borderRadius={10} />
          <Skeleton height={44} width="100%" borderRadius={10} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  headerBlock: {
    gap: 10,
    paddingVertical: 12,
  },
  productRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  productText: {
    flex: 1,
    gap: 8,
  },
  section: {
    gap: 12,
    paddingVertical: 12,
  },
});
