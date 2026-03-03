import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Skeleton from '../../../../general/components/Skeleton';

export default function DriverProfileSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScreenHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile Hero Skeleton ── */}
        <View style={[styles.heroCard, { backgroundColor: colors.surface }]}>
          {/* Avatar Area */}
          <View style={styles.avatarWrapper}>
            <Skeleton width={90} height={90} borderRadius={45} />
          </View>

          {/* Name */}
          <Skeleton width={140} height={24} style={styles.driverName} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Skeleton width={40} height={20} />
              <Skeleton width={50} height={14} style={{ marginTop: 4 }} />
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCard}>
              <Skeleton width={40} height={20} />
              <Skeleton width={50} height={14} style={{ marginTop: 4 }} />
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statCard}>
              <Skeleton width={40} height={20} />
              <Skeleton width={50} height={14} style={{ marginTop: 4 }} />
            </View>
          </View>
        </View>

        {/* ── Top Reviews Skeleton ── */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={120} height={24} style={styles.sectionTitle} />

          {/* Big rating + stars */}
          <View style={styles.ratingOverview}>
            <Skeleton width={80} height={56} />
            <View style={{ gap: 4 }}>
              <Skeleton width={100} height={22} />
              <Skeleton width={140} height={16} />
            </View>
          </View>

          {/* Rating bars */}
          <View style={styles.ratingBars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={styles.ratingBarRow}>
                <Skeleton width={42} height={14} />
                <View style={[styles.ratingBarTrack, { backgroundColor: colors.border }]} />
                <Skeleton width={24} height={14} />
              </View>
            ))}
          </View>
        </View>

        {/* ── Reviews List Skeleton ── */}
        <View style={styles.reviewsList}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.reviewCard, { backgroundColor: colors.surface }]}>
              {/* Header row */}
              <View style={styles.reviewHeader}>
                <Skeleton width={42} height={42} borderRadius={21} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={styles.reviewNameRow}>
                    <Skeleton width={120} height={20} />
                    <Skeleton width={80} height={14} />
                  </View>
                  <Skeleton width={90} height={14} style={{ marginTop: 4 }} />
                </View>
              </View>
              {/* Comment line */}
              <Skeleton width="100%" height={16} style={{ marginTop: 4 }} />
              <Skeleton width="80%" height={16} style={{ marginTop: 4 }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  // Hero
  heroCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  } as any,
  avatarWrapper: {
    borderRadius: 50,
    padding: 3,
    borderWidth: 3,
    borderColor: 'transparent', // No border color while loading
  },
  driverName: {
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 12,
  },
  // Top Reviews section
  section: {
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  } as any,
  sectionTitle: {
    marginBottom: 16,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  ratingBars: {
    gap: 10,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  // Reviews list
  reviewsList: {
    gap: 10,
    paddingHorizontal: 16,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  } as any,
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
});
