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
  'in_progress',
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
  const subtitle = booking.durationLabel || booking.statusLabel || t('single_vendor_active_service_default_subtitle');
  const progressPercent = resolveProgressPercent(booking.jobStatus ?? booking.status);
  const statusLabel = resolveBookingStatusLabel(
    booking.jobStatus ?? booking.status,
    booking.statusLabel,
    t,
  ).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.cardSoft,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
          opacity: pressed ? 0.95 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.leadingIconWrap,
            { backgroundColor: colors.cardPeach },
          ]}
        >
          <Icon type="MaterialCommunityIcons" name="pipe-wrench" size={26} color={colors.primary} />
        </View>

        <View style={styles.textBlock}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
            <Text
              style={{
                color: colors.primary,
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
              color: colors.text,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.lg,
            }}
            numberOfLines={1}
            weight="bold"
          >
            {title}
          </Text>
          <View style={styles.subtitleRow}>
            <Icon type="Feather" name="clock" size={15} color={colors.mutedText} />
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              }}
              numberOfLines={1}
              weight="medium"
            >
              {subtitle}
            </Text>
          </View>
        </View>

        <View style={[styles.iconWrap, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons color={colors.white} name="dots-horizontal" size={24} />
        </View>
      </View>

      <View style={styles.progressRow}>
        <View style={[styles.progressTrack, { backgroundColor: colors.cardPeach }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${progressPercent}%`,
              },
            ]}
          />
        </View>
        <Text
          style={{
            color: colors.text,
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
  subtitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
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
