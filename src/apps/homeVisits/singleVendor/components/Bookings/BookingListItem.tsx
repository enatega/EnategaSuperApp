import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type {
  HomeVisitsSingleVendorBookingItem,
  HomeVisitsSingleVendorBookingsTab,
} from '../../api/types';
import { resolveBookingStatusLabel } from '../../utils/bookingStatusLabel';
import { normalizeJobStatus } from '../../utils/trackWorkerStatus';

type Props = {
  booking: HomeVisitsSingleVendorBookingItem;
  tab: HomeVisitsSingleVendorBookingsTab;
  itemLabel: string;
  itemsLabel: string;
  viewDetailsLabel: string;
  bookAgainLabel: string;
  onBookAgain?: (orderId: string) => void;
  onViewDetails?: (orderId: string) => void;
  onPress?: (orderId: string) => void;
};

export default function BookingListItem({
  booking,
  tab,
  itemLabel,
  itemsLabel,
  viewDetailsLabel,
  bookAgainLabel,
  onBookAgain,
  onViewDetails,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const shouldShowViewDetails = booking.canViewDetails && tab === 'ongoing';
  const shouldShowBookAgain = booking.canBookAgain && tab === 'past';
  const shouldShowStatusBadge = booking.bookingType !== 'contract';
  const statusLabel = resolveBookingStatusLabel(
    booking.jobStatus ?? booking.status,
    booking.statusLabel,
    t,
  );
  const statusTone = getStatusTone(booking.jobStatus ?? booking.status, colors);
  const metadata = [
    booking.durationLabel,
    getItemCountLabel(booking.itemCount, itemLabel, itemsLabel),
    formatAmount(booking.totalAmount),
  ]
    .filter(Boolean)
    .join('  •  ');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress ? () => onPress(booking.orderId) : undefined}
      style={styles.container}
    >
      <View style={styles.leftContent}>
        <Image
          source={{ uri: booking.image ?? 'https://placehold.co/600x400/png' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
              weight="semiBold"
            >
              {booking.title}
            </Text>
            {shouldShowStatusBadge ? (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: statusTone.backgroundColor,
                    borderColor: statusTone.borderColor,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: statusTone.accentColor },
                  ]}
                />
                <Text
                  numberOfLines={1}
                  style={[
                    styles.statusText,
                    {
                      color: statusTone.textColor,
                      fontSize: typography.size.xs2,
                      lineHeight: typography.lineHeight.sm,
                    },
                  ]}
                  weight="medium"
                >
                  {statusLabel}
                </Text>
              </View>
            ) : null}
          </View>
          <Text
            numberOfLines={1}
            style={[
              styles.meta,
              {
                color: colors.iconMuted,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              },
            ]}
            weight="medium"
          >
            {metadata}
          </Text>
        </View>
      </View>
      {shouldShowViewDetails ? (
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            if (onViewDetails) {
              onViewDetails(booking.orderId);
            }
          }}
          style={[styles.actionButton, { borderColor: colors.border }]}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="medium"
          >
            {viewDetailsLabel}
          </Text>
        </Pressable>
      ) : null}
      {shouldShowBookAgain ? (
        <Pressable
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            if (onBookAgain) {
              onBookAgain(booking.orderId);
            }
          }}
          style={[styles.actionButton, { borderColor: colors.border }]}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="medium"
          >
            {bookAgainLabel}
          </Text>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

function getItemCountLabel(itemCount: number, itemLabel: string, itemsLabel: string) {
  if (itemCount === 1) {
    return `1 ${itemLabel}`;
  }

  return `${itemCount} ${itemsLabel}`;
}

function formatAmount(totalAmount?: number | null) {
  if (typeof totalAmount !== 'number') {
    return '$-';
  }

  const amount = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalAmount);

  return `$${amount}`;
}

function getStatusTone(
  statusValue: string | null | undefined,
  colors: ReturnType<typeof useTheme>['colors'],
) {
  const normalizedStatus = normalizeJobStatus(statusValue);

  switch (normalizedStatus) {
    case 'completed':
    case 'marked_complete':
      return {
        backgroundColor: colors.successSoft,
        borderColor: colors.success,
        textColor: colors.successText,
        accentColor: colors.success,
      };
    case 'cancelled':
    case 'rejected':
    case 'failed':
      return {
        backgroundColor: colors.dangerSoft,
        borderColor: colors.danger,
        textColor: colors.dangerText,
        accentColor: colors.danger,
      };
    case 'payment_requested':
      return {
        backgroundColor: colors.backgroundTertiary,
        borderColor: colors.primary,
        textColor: colors.primary,
        accentColor: colors.primary,
      };
    case 'worker_assigned':
    case 'on_my_way':
    case 'reached':
    case 'job_started':
    case 'service_started':
    case 'in_progress':
      return {
        backgroundColor: colors.warningSoft,
        borderColor: colors.warning,
        textColor: colors.warningText,
        accentColor: colors.warning,
      };
    case 'pending':
    case 'scheduled':
    case 'confirmed':
    default:
      return {
        backgroundColor: colors.backgroundTertiary,
        borderColor: colors.border,
        textColor: colors.iconMuted,
        accentColor: colors.iconMuted,
      };
  }
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    minWidth: 106,
    paddingHorizontal: 14,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  details: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  image: {
    borderRadius: 8,
    height: 49,
    width: 56,
  },
  leftContent: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minWidth: 0,
  },
  meta: {
    letterSpacing: 0,
  },
  statusBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    flexShrink: 1,
    gap: 6,
    marginLeft: 10,
    maxWidth: '48%',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusDot: {
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  statusText: {
    letterSpacing: 0,
  },
  title: {
    letterSpacing: 0,
    flex: 1,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 0,
  },
});
