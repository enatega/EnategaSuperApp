import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Skeleton from '../../../../../general/components/Skeleton';
import { useTheme } from '../../../../../general/theme/theme';

export default function ServiceDetailsSkeleton() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Skeleton borderRadius={0} height={200} width="100%" />

          <View
            style={[
              styles.heroActions,
              {
                paddingTop: insets.top + 12,
              },
            ]}
          >
            <Skeleton borderRadius={20} height={40} width={40} />
            <Skeleton borderRadius={20} height={40} width={40} />
          </View>
        </View>

        <View style={styles.sectionBody}>
          <Skeleton height={30} width="70%" />
          <Skeleton height={18} width="40%" />
          <Skeleton height={24} width="35%" />
          <Skeleton height={22} width="95%" />
          <Skeleton height={22} width="90%" />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.optionsSection}>
          <Skeleton height={24} width="45%" />
          <Skeleton height={18} width="20%" />
          <Skeleton height={22} width="100%" />
          <Skeleton height={22} width="100%" />
          <Skeleton height={22} width="100%" />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.optionsSection}>
          <Skeleton height={24} width="50%" />
          <Skeleton height={18} width="20%" />
          <Skeleton height={22} width="100%" />
          <Skeleton height={22} width="100%" />
          <Skeleton height={22} width="100%" />
          <Skeleton height={22} width="100%" />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <View style={styles.footerRow}>
          <View style={styles.footerMeta}>
            <Skeleton height={22} width="55%" />
            <Skeleton height={18} width="85%" />
          </View>
          <View style={styles.footerAction}>
            <Skeleton borderRadius={10} height={48} width="100%" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  footerAction: {
    flex: 1,
  },
  footerMeta: {
    flex: 1,
    gap: 6,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  heroActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
    width: '100%',
  },
  optionsSection: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionBody: {
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
