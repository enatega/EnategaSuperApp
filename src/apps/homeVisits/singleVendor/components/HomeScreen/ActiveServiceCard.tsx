import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import type { HomeVisitsSingleVendorBookingItem } from '../../api/types';
import { resolveBookingStatusLabel } from '../../utils/bookingStatusLabel';
import { normalizeJobStatus } from '../../utils/trackWorkerStatus';

const BOOKING_PROGRESS_PIPELINE = [
  'scheduled',
  'pending',
  'confirmed',
  'worker_assigned',
  'on_my_way',
  'reached',
  'job_started',
  'service_started',
  'in_progress',
  'marked_complete',
  'payment_requested',
  'completed',
] as const;

function resolveProgressPercent(statusValue?: string | null) {
  const normalizedStatus = normalizeJobStatus(statusValue);

  if (!normalizedStatus) {
    return 0;
  }

  if (normalizedStatus === 'cancelled' || normalizedStatus === 'rejected' || normalizedStatus === 'failed') {
    return 100;
  }

  const stageIndex = BOOKING_PROGRESS_PIPELINE.indexOf(normalizedStatus as (typeof BOOKING_PROGRESS_PIPELINE)[number]);

  if (stageIndex < 0) {
    return 0;
  }

  return Math.round(((stageIndex + 1) / BOOKING_PROGRESS_PIPELINE.length) * 100);
}

type Props = {
  booking: HomeVisitsSingleVendorBookingItem;
  onPress: () => void;
};

export default function ActiveServiceCard({ booking, onPress }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');

  const title = booking.title || t('single_vendor_active_service_default_title');
  const statusLabel = resolveBookingStatusLabel(
    booking.jobStatus ?? booking.status,
    booking.statusLabel,
    t,
  ).toUpperCase();
  const progressPercent = resolveProgressPercent(booking.jobStatus ?? booking.status);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.primary,
          borderColor: colors.primaryDark,
          shadowColor: colors.shadowColor,
          opacity: pressed ? 0.95 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.leadingIconWrap,
            { backgroundColor: 'rgba(255,255,255,0.2)' },
          ]}
        >
          <Icon type="MaterialCommunityIcons" name="pipe-wrench" size={26} color={colors.white} />
        </View>

        <View style={styles.textBlock}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.white }]} />
            <Text
              style={{
                color: colors.white,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="semiBold"
            >
              {statusLabel}
            </Text>
          </View>
          <Text
              style={{
                color: colors.white,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.lg,
              }}
            numberOfLines={1}
            weight="bold"
          >
            {title}
          </Text>
        </View>

        <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
          <MaterialCommunityIcons color={colors.white} name="dots-horizontal" size={22} />
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.28)' }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.white,
                width: `${progressPercent}%`,
              },
            ]}
          />
        </View>
        <Text
          style={{
            color: colors.white,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {progressPercent}% completed
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: -2,
    paddingHorizontal: 12,
    paddingVertical: 11,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  leadingIconWrap: {
    alignItems: 'center',
    borderRadius: 30,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statusDot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  textBlock: {
    flex: 1,
    gap: 3,
    marginRight: 8,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 20,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  progressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  progressTrack: {
    borderRadius: 4,
    flex: 1,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 4,
    height: '100%',
  },
});
