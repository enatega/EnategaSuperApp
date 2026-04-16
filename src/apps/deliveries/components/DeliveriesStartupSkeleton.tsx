import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../general/theme/theme';
import Skeleton from '../../../general/components/Skeleton';
import DiscoveryCategorySkeleton from './discovery/DiscoveryCategorySkeleton';
import DiscoveryResultsSkeleton from './discovery/DiscoveryResultsSkeleton';

export default function DeliveriesStartupSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Skeleton width="42%" height={28} borderRadius={14} />
            <Skeleton width="62%" height={16} borderRadius={8} />
          </View>

          <View style={styles.searchSection}>
            <Skeleton width="100%" height={54} borderRadius={18} />
          </View>

          <View style={styles.section}>
            <Skeleton width={132} height={18} borderRadius={9} />
            <DiscoveryCategorySkeleton />
          </View>

          <View style={styles.section}>
            <Skeleton width={148} height={18} borderRadius={9} />
            <DiscoveryResultsSkeleton />
          </View>

          <View style={styles.section}>
            <Skeleton width={156} height={18} borderRadius={9} />
            <DiscoveryResultsSkeleton />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    gap: 22,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerSection: {
    gap: 12,
    paddingTop: 8,
  },
  searchSection: {
    gap: 12,
  },
  section: {
    gap: 16,
  },
});
