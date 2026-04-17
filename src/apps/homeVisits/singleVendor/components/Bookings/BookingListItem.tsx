import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type {
  HomeVisitsSingleVendorBookingItem,
  HomeVisitsSingleVendorBookingsTab,
} from '../../api/types';

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
  const shouldShowViewDetails = booking.canViewDetails && tab === 'ongoing';
  const shouldShowBookAgain = booking.canBookAgain && tab === 'past';
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
  title: {
    letterSpacing: 0,
  },
});
