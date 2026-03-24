import React, { memo, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
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

function FindingRideBidCard({
  bid,
  onPressDecline,
  onPressAccept,
  isAccepting = false,
  isDeclining = false,
  isInteractionLocked = false,
}: Props) {
  const { colors } = useTheme();
  const isBusy = isAccepting || isDeclining || isInteractionLocked;
  const remainingTimeMs = bid.remainingTimeMs ?? BID_VALIDITY_MS;
  const isExpired = remainingTimeMs <= 0;
  const fallbackMetaText = bid.status ?? (isExpired ? 'Expired' : `${Math.ceil(remainingTimeMs / 1000)}s left`);
  const progress = useRef(new Animated.Value(Math.max(Math.min(remainingTimeMs / BID_VALIDITY_MS, 1), 0))).current;

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
          <View style={styles.profileBlock}>
            {bid.driverAvatarUri ? (
              <Image source={{ uri: bid.driverAvatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.findingRideMutedSurface }]}>
                <Text weight="semiBold" style={[styles.avatarInitials, { color: colors.findingRideMutedText }]}>
                  {bid.driverName.slice(0, 1)}
                </Text>
              </View>
            )}

            <View style={styles.leftBlock}>
              <View style={styles.metaRow}>
                <Text style={[styles.driverName, { color: colors.text }]} numberOfLines={1}>
                  {bid.driverName}
                </Text>
                {typeof bid.rating === 'number' ? (
                  <View style={styles.metaInline}>
                    <Ionicons name="star" size={16} color="#FBC02D" />
                    <Text style={[styles.metaText, { color: colors.text }]}>
                      {bid.rating.toFixed(2)}
                    </Text>
                  </View>
                ) : null}
                {typeof bid.driverRides === 'number' ? (
                  <Text style={[styles.metaText, { color: colors.mutedText }]}>
                    ({bid.driverRides.toLocaleString()} rides)
                  </Text>
                ) : null}
              </View>
              {bid.vehicleLabel ? (
                <Text style={[styles.vehicleText, { color: colors.text }]} numberOfLines={1}>
                  {bid.vehicleLabel}
                </Text>
              ) : (
                <Text style={[styles.vehicleText, { color: colors.mutedText }]} numberOfLines={1}>
                  {fallbackMetaText}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.rightBlock}>
            <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.text }]}>
              {typeof bid.etaMin === 'number' ? `${bid.etaMin} min` : fallbackMetaText}
            </Text>
            {typeof bid.distanceKm === 'number' ? (
              <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.text }]}>
                {`${bid.distanceKm.toFixed(1)} km`}
              </Text>
            ) : null}
          </View>
        </View>

        <Text weight="extraBold" style={[styles.amount, { color: colors.findingRidePrimary }]}>
          {formatRideCurrency(bid.amount)}
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
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    lineHeight: 20,
  },
  leftBlock: {
    flex: 1,
    gap: 0,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'nowrap',
  },
  metaInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
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
