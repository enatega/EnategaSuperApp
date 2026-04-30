import React, { memo, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import type { FindingRideBid } from '../types/bids';

const BID_VALIDITY_MS = 15_000;

type Props = {
  bid: FindingRideBid;
  onPressDecline?: (bid: FindingRideBid) => void;
  onPressAccept?: (bid: FindingRideBid) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
  isInteractionLocked?: boolean;
};

function buildInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return 'DR';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
}

function FindingRideBidCard({
  bid,
  onPressDecline,
  onPressAccept,
  isAccepting = false,
  isDeclining = false,
  isInteractionLocked = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const isBusy = isAccepting || isDeclining || isInteractionLocked;
  const remainingTimeMs = bid.remainingTimeMs ?? BID_VALIDITY_MS;
  const isExpired = remainingTimeMs <= 0;
  const fallbackMetaText = isExpired ? 'Expired' : `${Math.ceil(remainingTimeMs / 1000)}s left`;
  const statusLabel = bid.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
  const progress = useRef(new Animated.Value(Math.max(Math.min(remainingTimeMs / BID_VALIDITY_MS, 1), 0))).current;
  const riderName = bid.driverName
    ?? bid.rider?.userProfile?.user?.name
    ?? t('ride_finding_driver_offer_label');
  const initials = buildInitials(riderName);
  const ratingValue = bid.rating?.average ?? bid.stats?.averageRating;
  const ridesCount = bid.stats?.totalRides;
  const vehicleLabel = bid.vehicle?.name ?? bid.rider?.vehicle_name ?? `Bid #${bid.id.slice(0, 8)}`;
  const fareValue = typeof bid.offeredFare === 'number' ? bid.offeredFare : bid.price;


  useEffect(() => {
    const normalizedProgress = Math.max(Math.min(remainingTimeMs / BID_VALIDITY_MS, 1), 0);
    const animationDurationMs = Math.max(remainingTimeMs, 0);

    progress.stopAnimation();
    progress.setValue(normalizedProgress);

    if (animationDurationMs <= 0) {
      return undefined;
    }

    const animation = Animated.timing(progress, {
      toValue: 0,
      duration: animationDurationMs,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bid.expiresAt, bid.id, progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.findingRideBorderSoft,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.rowTop}>
          <View style={[styles.avatar, { backgroundColor: colors.cardBlue }]}>
            <Text weight="semiBold" style={{ color: colors.text, fontSize: 12, lineHeight: 18 }}>
              {initials}
            </Text>
          </View>

          <View style={styles.leftBlock}>
            <View style={styles.nameRatingRow}>
              <Text style={[styles.driverName, { color: colors.text }]} numberOfLines={1}>
                {riderName}
              </Text>

              {typeof ratingValue === 'number' ? (
                <View style={styles.ratingRow}>
                  <Icon type="MaterialCommunityIcons" name="star" size={16} color={colors.yellow500} />
                  <Text style={[styles.driverName, { color: colors.text }]} numberOfLines={1}>
                    {ratingValue.toFixed(2)}
                  </Text>
                </View>
              ) : null}

              {typeof ridesCount === 'number' ? (
                <Text style={[styles.vehicleText, { color: colors.mutedText }]} numberOfLines={1}>
                  ({ridesCount.toLocaleString()} rides)
                </Text>
              ) : null}
            </View>

            <Text style={[styles.vehicleText, { color: colors.text }]} numberOfLines={1}>
              {vehicleLabel}
            </Text>
          </View>

          <View style={styles.rightBlock}>
            <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.text }]}>
              {statusLabel}
            </Text>
            <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.mutedText }]}>
              {fallbackMetaText}
            </Text>
          </View>
        </View>

        <Text weight="extraBold" style={[styles.amount, { color: colors.findingRidePrimary }]}>
          {formatRideCurrency(fareValue)}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => onPressDecline?.(bid)}
            disabled={isBusy || isExpired}
            style={[
              styles.declineButton,
              { backgroundColor: colors.backgroundTertiary },
              (isBusy || isExpired) ? styles.buttonDisabled : null,
            ]}
          >
            {isDeclining ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text weight="medium" style={[styles.declineLabel, { color: colors.text }]}>
                Decline
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => onPressAccept?.(bid)}
            disabled={isBusy || isExpired}
            style={[
              styles.acceptButton,
              { backgroundColor: colors.findingRidePrimary },
              (isBusy || isExpired) ? styles.buttonDisabled : null,
            ]}
          >
            <View style={styles.progressOverlayWrap}>
              <Animated.View
                style={[
                  styles.progressOverlay,
                  {
                    width: progressWidth,
                    backgroundColor: 'rgba(0,0,0,0.18)',
                  },
                ]}
              />
            </View>
            <Text weight="medium" style={styles.acceptLabel}>
              {isAccepting ? 'Accepting...' : isExpired ? 'Expired' : 'Accept'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default memo(FindingRideBidCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  content: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    gap: 14,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBlock: {
    flex: 1,
    gap: 2,
  },
  nameRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 2,
  },
  driverName: {
    fontSize: 14,
    lineHeight: 22,
  },
  vehicleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  metaTextStrong: {
    fontSize: 14,
    lineHeight: 22,
  },
  amount: {
    fontSize: 40,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    width: '100%',
  },
  declineButton: {
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  declineLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  acceptButton: {
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 163.5,
    overflow: 'hidden',
  },
  progressOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  progressOverlay: {
    height: '100%',
  },
  acceptLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
