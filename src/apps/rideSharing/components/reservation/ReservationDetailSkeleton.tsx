import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Skeleton from '../../../../general/components/Skeleton';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { useTranslation } from 'react-i18next';

export default function ReservationDetailSkeleton() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('reservation_detail_title')} />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ride Info Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Skeleton width={64} height={32} style={{ marginRight: 12 }} />
              <Skeleton width={100} height={24} />
            </View>
            <Skeleton width={80} height={24} />
          </View>
        </View>

        {/* Driver Info Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={100} height={16} style={{ marginBottom: 12 }} />
          <View style={styles.row}>
            <Skeleton width={48} height={48} borderRadius={24} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width={120} height={20} style={{ marginBottom: 4 }} />
              <Skeleton width={150} height={16} />
            </View>
          </View>
        </View>

        {/* Schedule Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={100} height={16} style={{ marginBottom: 12 }} />
          <View style={styles.row}>
            <Skeleton width={24} height={24} borderRadius={12} style={{ marginRight: 12 }} />
            <Skeleton width={200} height={20} />
          </View>
        </View>

        {/* Payment Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
          <View style={styles.row}>
            <Skeleton width={40} height={40} borderRadius={8} style={{ marginRight: 12 }} />
            <Skeleton width={80} height={20} />
          </View>
        </View>

        {/* Route Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
          <View style={{ gap: 16 }}>
            <View style={styles.row}>
              <Skeleton width={12} height={12} borderRadius={6} style={{ marginRight: 12 }} />
              <Skeleton width="80%" height={16} />
            </View>
            <View style={styles.row}>
              <Skeleton width={12} height={12} borderRadius={6} style={{ marginRight: 12 }} />
              <Skeleton width="60%" height={16} />
            </View>
          </View>
        </View>

        {/* Status Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
          <Skeleton width={100} height={32} borderRadius={8} />
        </View>

        {/* Info Section Skeleton */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Skeleton width={150} height={20} style={{ marginBottom: 16 }} />
          
          <View style={[styles.row, { marginBottom: 16 }]}>
            <Skeleton width={28} height={28} borderRadius={4} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width={100} height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="90%" height={14} />
            </View>
          </View>

          <View style={styles.row}>
            <Skeleton width={28} height={28} borderRadius={4} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Skeleton width={120} height={16} style={{ marginBottom: 4 }} />
              <Skeleton width="90%" height={14} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  section: {
    padding: 12,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
