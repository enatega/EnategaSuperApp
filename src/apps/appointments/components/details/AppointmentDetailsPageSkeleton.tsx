import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import Skeleton from '../../../../general/components/Skeleton';
import { useTheme } from '../../../../general/theme/theme';
import AppointmentDetailsServiceCardSkeleton from './AppointmentDetailsServiceCardSkeleton';

type Props = {
  insets: EdgeInsets;
};

export default function AppointmentDetailsPageSkeleton({ insets }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.screen}>
      <View style={styles.heroContainer}>
        <Skeleton borderRadius={0} height="100%" width="100%" />

        <View style={[styles.heroActions, { paddingTop: insets.top + 10 }]}>
          <Skeleton borderRadius={999} height={54} width={54} />
          <Skeleton borderRadius={999} height={54} width={54} />
        </View>
      </View>

      <View
        style={[
          styles.surfaceCard,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={[styles.heroHandle, { backgroundColor: colors.primary }]} />

        <View style={styles.titleContent}>
          <Skeleton borderRadius={8} height={34} width="72%" />
          <View style={styles.ratingRow}>
            <Skeleton borderRadius={999} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width={132} />
          </View>
          <Skeleton borderRadius={6} height={18} width="84%" />
          <Skeleton borderRadius={6} height={18} width="40%" />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Skeleton borderRadius={8} height={24} width="42%" />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Skeleton borderRadius={8} height={26} width="46%" />
        <View style={styles.tabsRow}>
          <Skeleton borderRadius={999} height={38} width={82} />
          <Skeleton borderRadius={999} height={38} width={92} />
          <Skeleton borderRadius={999} height={38} width={88} />
        </View>
      </View>

      <View style={[styles.footerSections, { backgroundColor: colors.surface }]}>
        <View style={styles.servicesList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <AppointmentDetailsServiceCardSkeleton key={`details-page-skeleton-${index}`} />
          ))}
        </View>

        <View style={[styles.sectionBlock, { borderTopColor: colors.border }]}>
          <Skeleton borderRadius={8} height={24} width={116} />
          <View style={styles.reviewStars}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={`review-star-skeleton-${index}`} borderRadius={8} height={18} width={18} />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 18,
  },
  footerSections: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  heroContainer: {
    height: 260,
    overflow: 'hidden',
  },
  heroHandle: {
    alignSelf: 'center',
    borderRadius: 999,
    height: 4,
    marginBottom: 16,
    width: 28,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  screen: {
    flex: 1,
  },
  sectionBlock: {
    borderTopWidth: 1,
    gap: 16,
    paddingTop: 24,
  },
  servicesList: {
    paddingTop: 2,
  },
  surfaceCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -22,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  titleContent: {
    gap: 8,
  },
});
